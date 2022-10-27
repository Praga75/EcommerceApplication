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
  selector: "sellersignup",
  templateUrl: "./sellersignup.component.html",
  styleUrls: []
})
export class sellersignup implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("sellersignup");
  }
  //ngOnInit() { }

  insertSellerDetails: any = {};
  insertSellerAddress: any = {};
  httpresponse: any = null;
  httpresponseTotal: any;
  insertSellerAddress2Err: any;
  httpresponse1: any = null;
  httpresponse1Total: any;
  insertSellerDetailsErr: any;
  ngOnInit() {}

  /*
   *insertData
   */

  insertData() {
    this.api
      .insertSellerDetails(this.insertSellerDetails)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (httpresponse: any) => {
          if (httpresponse && httpresponse.results != null) {
            this.httpresponse1 = httpresponse.results;
          } else {
            this.httpresponse1 = httpresponse;
          }
        },
        error: (insertSellerDetailsErr: any) => {
          this.insertSellerDetailsErr = insertSellerDetailsErr;
        }
      });
    this.api
      .insertSellerAddress2(this.insertSellerAddress)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (httpresponse: any) => {
          if (httpresponse && httpresponse.results != null) {
            this.httpresponse = httpresponse.results;
          } else {
            this.httpresponse = httpresponse;
          }
        },
        error: (insertSellerAddress2Err: any) => {
          this.insertSellerAddress2Err = insertSellerAddress2Err;
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
