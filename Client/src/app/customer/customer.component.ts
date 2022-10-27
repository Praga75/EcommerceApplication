import {
  Component,
  Injectable,
  EventEmitter,
  Output,
  Input,
  OnInit,
  OnDestroy
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DewService } from "@services/dew.service";
import { DewAuthService } from "../authentication/auth.service";
import { ApiService } from "@services/api.services";
import { MainService } from "@services/main.services";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import * as _ from "lodash";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "customer",
  templateUrl: "./customer.component.html",
  styleUrls: []
})
export class customer implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("customer");
  }
  //ngOnInit() { }

  httpresponse: any = null;
  httpresponseTotal: any;
  insertRichCardCustomerDetailsErr: any;
  httpresponse1: any = null;
  httpresponse1Total: any;
  insertRichCardCutomerAddressErr: any;
  insertdetails: any = {};
  insertAddress: any = {};
  ngOnInit() {}

  /*
   *insert
   */

  insert() {
    this.api
      .insertRichCardCustomerDetails(this.insertdetails)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (httpresponse: any) => {
          if (httpresponse && httpresponse.results != null) {
            this.httpresponse = httpresponse.results;
          } else {
            this.httpresponse = httpresponse;
          }
        },
        error: (insertRichCardCustomerDetailsErr: any) => {
          this.insertRichCardCustomerDetailsErr = insertRichCardCustomerDetailsErr;
        }
      });
    this.api
      .insertRichCardCutomerAddress(this.insertAddress)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (httpresponse: any) => {
          if (httpresponse && httpresponse.results != null) {
            this.httpresponse1 = httpresponse.results;
          } else {
            this.httpresponse1 = httpresponse;
          }
        },
        error: (insertRichCardCutomerAddressErr: any) => {
          this.insertRichCardCutomerAddressErr = insertRichCardCutomerAddressErr;
        }
      });
  }
  //prefix and dependency injection will be passed to custom code function/script.
  //custom code function should start with prefix  (Ex. generate() {})

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next();
    this.destroy$.complete();
  }
}
