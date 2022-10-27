import {
  Component, Injectable, Inject, EventEmitter, Output, Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '@services/main.services';
import { DewService } from '@services/dew.service';
import { ApiService } from '@services/api.services';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


import * as _ from 'lodash';
import { Title } from '@angular/platform-browser';




import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-terms-conditions',
  templateUrl: './termsAndCondition.component.html',
  styleUrls: ['termsandcondition.css']
})
export class termsAndConditionsComponent {
  roomresponse: any;
  checked: any;
  result: any;
  showCancel: boolean = false;

  constructor(
    private route: Router,
    private dialog: MatDialog,
    private router: Router,
    private mainService: MainService,
    private dewService: DewService,
    private api: ApiService,
    private titleService: Title,
    public snackBar: MatSnackBar,
  ) {
    // this.titleService.setTitle('Terms and Conditions - MBE Disaster Ready – PPE');

  }

  newRequest: any = {};

  ngOnInit() {
    this.showCancel = false;

  }

  ngOnDestroy(): void {
  }
  cancel() {
  }
}



@Component({
  selector: 'terms-and-conditions-modal',
  templateUrl: './termsAndCondition.component.html',
})
export class termsAndConditionDialog implements OnInit, OnDestroy {
  showCancel: boolean = true;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public tcDialog: MatDialogRef<termsAndConditionDialog>,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {
    this.showCancel = true;
  }

  ngOnInit() { }

  cancel() {
    this.tcDialog.close();
  }

  ok() {
    this.tcDialog.close(this.user)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
