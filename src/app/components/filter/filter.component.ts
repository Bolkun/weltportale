import { Component, Input, OnInit } from '@angular/core';
import { ApiReliefwebService } from 'src/app/services/api-reliefweb.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Router } from "@angular/router";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() dashboardCountry!: string;
  @Input() dashboardDate!: string;
  @Input() dashboardDisaster!: string;

  formCountry: any = "World";
  formDate: any = this.apiReliefwebService.getCurrentDate();
  formDisaster: any = "All";
  public countries: any[] = [
    'Afghanistan',
    'Aland Islands (Finland)',
    'Albania',
    'Algeria',
    'American Samoa',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Aruba (The Netherlands)',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Azores Islands (Portugal)',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia (Plurinational State of)',
    'Bonaire, Saint Eustatius and Saba (The Netherlands)',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'British Virgin Islands',
    'Brunei Darussalam',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Canary Islands (Spain)',
    'Cayman Islands',
    'Central African Republic',
    'Chad',
    'Channel Islands',
    'Chile',
    'China',
    'China - Hong Kong (Special Administrative Region)',
    'China - Macau (Special Administrative Region)',
    'China - Taiwan Province',
    'Christmas Island (Australia)',
    'Cocos (Keeling) Islands (Australia)',
    'Colombia',
    'Comoros',
    'Congo',
    'Cook Islands',
    'Costa Rica',
    'Côte d\'Ivoire',
    'Croatia',
    'Cuba',
    'Curaçao (The Netherlands)',
    'Cyprus',
    'Czechia',
    'Democratic People\'s Republic of Korea',
    'Democratic Republic of the Congo',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Easter Island (Chile)',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Falkland Islands (Malvinas)',
    'Faroe Islands (Denmark)',
    'Fiji',
    'Finland',
    'France',
    'French Guiana (France)',
    'French Polynesia (France)',
    'Gabon',
    'Galapagos Islands (Ecuador)',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Greece',
    'Greenland (Denmark)',
    'Grenada',
    'Guadeloupe (France)',
    'Guam',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Heard Island and McDonald Islands (Australia)',
    'Holy See',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran (Islamic Republic of)',
    'Iraq',
    'Ireland',
    'Isle of Man (The United Kingdom of Great Britain and Northern Ireland)',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kuwait',
    'Kyrgyzstan',
    'Lao People\'s Democratic Republic (the)',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Madeira (Portugal)',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Martinique (France)',
    'Mauritania',
    'Mauritius',
    'Mayotte (France)',
    'Mexico',
    'Micronesia (Federated States of)',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'Netherlands Antilles (The Netherlands)',
    'New Caledonia (France)',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Niue (New Zealand)',
    'Norfolk Island (Australia)',
    'Northern Mariana Islands (The United States of America)',
    'Norway',
    'occupied Palestinian territory',
    'Oman',
    'Pakistan',
    'Palau',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Pitcairn Islands',
    'Poland',
    'Portugal',
    'Puerto Rico (The United States of America)',
    'Qatar',
    'Republic of Korea',
    'Réunion (France)',
    'Romania',
    'Russian Federation',
    'Rwanda',
    'Saint Barthélemy (France)',
    'Saint Helena',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Martin (France)',
    'Saint Pierre and Miquelon (France)',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Sint Maarten (The Netherlands)',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Svalbard and Jan Mayen Islands',
    'Sweden',
    'Switzerland',
    'Syrian Arab Republic',
    'Tajikistan',
    'Thailand',
    'the Republic of North Macedonia',
    'Timor-Leste',
    'Togo',
    'Tokelau',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Turks and Caicos Islands',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom of Great Britain and Northern Ireland',
    'United Republic of Tanzania',
    'United States of America',
    'United States Virgin Islands',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela (Bolivarian Republic of)',
    'Viet Nam',
    'Wallis and Futuna (France)',
    'Western Sahara',
    'World',
    'Yemen',
    'Zambia',
    'Zimbabwe'
  ];
  public disaster_types: any[] = [
    'All', // not in api!
    'Cold Wave',
    'Complex Emergency',
    'Drought',
    'Earthquake',
    'Epidemic',
    'Extratropical Cyclone',
    'Fire',
    'Flash Flood',
    'Flood',
    'Heat Wave',
    'Insect Infestation',
    'Land Slide',
    'Mud Slide',
    'Other',
    'Severe Local Storm',
    'Snow Avalanche',
    'Storm Surge',
    'Technological Disaster',
    'Tropical Cyclone',
    'Tsunami',
    'Volcano',
    'Wild Fire'
  ];

  constructor(
    public apiReliefwebService: ApiReliefwebService,
    public dashboardComponent: DashboardComponent,
    public router: Router
  ) { }

  ngOnInit(): void {
    if (this.dashboardCountry) {
      this.formCountry = this.dashboardCountry;
    }
    if (this.dashboardDate) {
      this.formDate = this.dashboardDate;
    }
    if (this.dashboardDisaster) {
      this.formDisaster = this.dashboardDisaster;
    }
  }

  onFilterSubmit() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=> {
      this.dashboardComponent.musicOff();
      this.router.navigate(['dashboard/'+this.formCountry+'/'+this.formDate+'/'+this.formDisaster]);
    });
  }

  goToStartPage() {
    this.dashboardComponent.musicOff();
    this.router.navigate(['dashboard']);
  }

}
