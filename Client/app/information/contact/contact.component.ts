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
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact.component.html',
  styleUrls: ['contact.css']
})
export class contactKfComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  roomresponse: any;
  checked: any;
  result: any;
  user: any ={};
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


  ngOnInit() {
  }


  onSubmitMember(f: NgForm) {
    
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
