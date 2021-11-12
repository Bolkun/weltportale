import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
//import { auth } from 'firebase/app';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { FlashMessagesService } from 'flash-messages-angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userData: any; // Save logged in user data
  loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();
  flashMessageTimeout: number = 5000;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public ngZone: NgZone,          // NgZone service to remove outside scope warning
    public router: Router,
    public flashMessage: FlashMessagesService,
  ) {
    /* Login if user email verified */
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        this.GetUserData(user.uid);
        this.loggedIn.next(true);
      } else if (user && !user.emailVerified) {
        this.GetUserData(user.uid);
        this.loggedIn.next(false);
      } else {
        this.loggedIn.next(false);
      }
    });
  }

  SignUp(nickname: string, email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((result) => {
      /* Call the SendVerificaitonMail() function when new user sign up and returns promise */
      this.SendVerificationMail();
      this.SetUserData(result.user!, nickname);
    }).catch((error) => {
      this.flashMessage.show(error.message, { cssClass: 'alert-danger', timeout: this.flashMessageTimeout });
    });
  }

  SignIn(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then((result) => {
      /* Login if user email verified */
      if (!(result.user?.emailVerified)) {
        this.flashMessage.show('Please verify Email Address!', { cssClass: 'alert-danger', timeout: this.flashMessageTimeout });
        return false;
      }
      this.GetUserData(result.user.uid);
      localStorage.setItem('userEmail', JSON.stringify(result.user?.email));
      this.ngZone.run(() => {
        this.router.navigate(['dashboard']);
      });
    }).catch((error) => {
      this.flashMessage.show(error.message, { cssClass: 'alert-danger', timeout: this.flashMessageTimeout });
    });
  }

  SendVerificationMail() {
    if (this.afAuth.auth.currentUser !== null) {
      if (this.afAuth.auth.currentUser.emailVerified) {
        this.flashMessage.show('Email already verified!', { cssClass: 'alert-danger', timeout: this.flashMessageTimeout });
      } else {
        // SignUp
        return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
          // Function createUserWithEmailAndPassword() in SignIn method promise that emailVarified will be true
          this.router.navigate(['verify-email']);
        });
      }
    } else {
      this.flashMessage.show('Cannot send email to unknown user!', { cssClass: 'alert-danger', timeout: this.flashMessageTimeout });
    }
  }

  ResetPassword(passwordResetEmail: string) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail).then(() => {
      this.flashMessage.show('Password reset email sent, check your inbox!', { cssClass: 'alert-success', timeout: this.flashMessageTimeout });
    }).catch((error) => {
      this.flashMessage.show(error.message, { cssClass: 'alert-danger', timeout: this.flashMessageTimeout });
    });
  }

  isLoggedIn(): boolean {
    const userEmail = JSON.parse(localStorage.getItem('userEmail')!);
    if (userEmail == null) {
      return false;
    } else {
      return true;
    }
  }

  isAdminLoggedIn() {
    if (this.isLoggedIn()) {
      if (this.userData) {
        return (this.userData.role! === 'admin') ? true : false;
      }
    }
    return false;
  }

  // Sign up with Google
  GoogleReg() {
    //return this.RegLogin(new auth.GoogleAuthProvider());
  }

  // Sign up with Google
  GoogleLog() {
    //return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Reg logic to run auth providers
  // RegLogin(provider: auth.AuthProvider) {
  //   return this.afAuth.auth.signInWithPopup(provider).then((result) => {
  //     this.ngZone.run(() => {
  //       this.router.navigate(['dashboard']);
  //     });
  //     this.SetUserData(result.user!);
  //     localStorage.setItem('userEmail', JSON.stringify(result.user?.email));
  //   }).catch((error) => {
  //     this.flashMessage.show(error.message, { cssClass: 'alert-danger', timeout: this.flashMessageTimeout });
  //   });
  // }

  // Auth logic to run auth providers
  // AuthLogin(provider: auth.AuthProvider) {
  //   return this.afAuth.auth.signInWithPopup(provider).then((result) => {
  //     this.ngZone.run(() => {
  //       this.router.navigate(['dashboard']);
  //     });
  //     this.GetUserData(result.user!.uid);
  //     localStorage.setItem('userEmail', JSON.stringify(result.user?.email));
  //   }).catch((error) => {
  //     this.flashMessage.show(error.message, { cssClass: 'alert-danger', timeout: this.flashMessageTimeout });
  //   });
  // }

  GetUserData(uid: string) {
    if (uid) {
      const userCollection = this.afs.collection('users', ref => ref.where("uid", "==", uid)).valueChanges();
      userCollection.subscribe((data: any) => {
        this.userData = {
          uid: data[0].uid,
          role: data[0].role,
          email: data[0].email,
          displayName: data[0].displayName,
          photoURL: data[0].photoURL
        }
      });
    }
  }

  GetUserDataOnEmail(email: string) {
    return this.afs.collection('users', ref => ref.where("email", "==", email)).valueChanges();
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: firebase.User, nickname?: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    this.userData = {
      uid: user.uid,
      role: 'registeredUsers',
      email: user.email,
      displayName: (nickname) ? nickname : user.displayName,
      photoURL: user.photoURL!
    }
    return userRef.set(this.userData, {
      merge: true
    });
  }

  getUserPermission(role: string, email?: any) {
    if (!email) return ['all'];
    if (role == 'admin') {
      return [email, 'admin', 'registeredUsers', 'all'];
    } else if (role == 'registeredUsers') {
      return ['registeredUsers', 'all'];
    } else {
      return ['all'];
    }
  }

  // Logout
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('userEmail');
      this.router.navigate(['login']);
    });
  }
  
}
