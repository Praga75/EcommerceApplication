import { Component } from '@angular/core';
import { MainService } from '@services/main.services';
import { DewService } from '@services/dew.service';
import { ApiService } from '@services/api.services';
import { DewAuthService } from '@core/auth.service';


import * as _ from 'lodash';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookiepolicy.component.html',
  styleUrls: ['cookiepolicy.css']
})
export class cookiePolicyComponent {
  roomresponse: any;
  checked: any;
  result: any;
  constructor(
    private titleService: Title,
    public snackBar: MatSnackBar,
  ) {
    // this.titleService.setTitle('Terms and Conditions - MBE Disaster Ready – PPE');

  }

  newRequest: any = {};

  ngOnInit() {
  }





  ngOnDestroy(): void {
  }
}
