import { Component, Injectable, Inject, EventEmitter, Output, Input,
  OnInit,
  OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '@services/main.services';
import { DewService } from '@services/dew.service';
import { ApiService } from '@services/api.services';
import { DewAuthService } from '@core/auth.service';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import * as _ from 'lodash';
import { Title } from '@angular/platform-browser';



import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['privacypolicy.css']
})
export class privacyPolicyComponent implements OnInit, OnDestroy{
  roomresponse: any;
  checked: any;
  result: any;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: Router,
    private dialog: MatDialog,
    private router: Router,
    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title,
    public snackBar: MatSnackBar,
  ) {
    // this.titleService.setTitle('Terms and Conditions - MBE Disaster Ready – PPE');

  }

  newRequest: any = {};

  ngOnInit() {
  }





  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
