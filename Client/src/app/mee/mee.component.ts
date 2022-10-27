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
  selector: "mee",
  templateUrl: "./mee.component.html",
  styleUrls: []
})
export class mee implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("mee");
  }
  //ngOnInit() { }

  notverifyproductResponseList: any = [];
  notverifyproductResponseListTotal: any;
  notverifyproductErr: any;
  notverifyproductResponseListSelectedItem: any = null;
  notverifyproductResponseListSelectedItems: any = [];
  notverifyproductResponseListFilters: any = {};
  httpresponse: any = null;
  httpresponseTotal: any;
  updatestatusErr: any;
  httpresponse1: any = null;
  httpresponse1Total: any;
  updatestatusErr1: any;
  httpresponse12: any = null;
  httpresponse12Total: any;
  updateSellerProductErr: any;
  httpresponse123: any = null;
  httpresponse123Total: any;
  updatestatusErr12: any;
  notverifiedResponseList: any = [];
  notverifiedResponseListTotal: any;
  variedErr: any;
  notverifiedResponseListSelectedItem: any = null;
  notverifiedResponseListSelectedItems: any = [];
  notverifiedResponseListFilters: any = {};
  httpresponse1234: any = null;
  httpresponse1234Total: any;
  updatestatusErr123: any;
  httpresponse12345: any = null;
  httpresponse12345Total: any;
  updatesellerStatusErr: any;
  httpresponse123456: any = null;
  httpresponse123456Total: any;
  updatesellerStatusErr1: any;
  ngOnInit() {
    this.notver();
    this.notvproduct();
  }

  /*
   *notver
   */

  notver() {
    this.api
      .notverifyproduct()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notverifyproductResponseList: any) => {
          if (
            notverifyproductResponseList &&
            notverifyproductResponseList.results != null &&
            notverifyproductResponseList.total != null
          ) {
            this.notverifyproductResponseList =
              notverifyproductResponseList.results;
            this.notverifyproductResponseListTotal =
              notverifyproductResponseList.total;
          } else {
            this.notverifyproductResponseList = notverifyproductResponseList;
            this.notverifyproductResponseListTotal =
              notverifyproductResponseList.length;
          }
        },
        error: (notverifyproductErr: any) => {
          this.notverifyproductErr = notverifyproductErr;
        }
      });
  }

  /*
   *updatefun
   */

  updatefun() {
    this.api
      .updatesellerStatus(this.notverifyproductResponseListSelectedItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (httpresponse: any) => {
          if (httpresponse && httpresponse.results != null) {
            this.httpresponse123456 = httpresponse.results;
          } else {
            this.httpresponse123456 = httpresponse;
          }
        },
        error: (updatesellerStatusErr: any) => {
          this.updatesellerStatusErr1 = updatesellerStatusErr;
        }
      });
  }

  /*
   *notvproduct
   */

  notvproduct() {
    this.api
      .varied()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notverifiedResponseList: any) => {
          if (
            notverifiedResponseList &&
            notverifiedResponseList.results != null &&
            notverifiedResponseList.total != null
          ) {
            this.notverifiedResponseList = notverifiedResponseList.results;
            this.notverifiedResponseListTotal = notverifiedResponseList.total;
          } else {
            this.notverifiedResponseList = notverifiedResponseList;
            this.notverifiedResponseListTotal = notverifiedResponseList.length;
          }
        },
        error: (variedErr: any) => {
          this.variedErr = variedErr;
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
