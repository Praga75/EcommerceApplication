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
  selector: "addproduct",
  templateUrl: "./addproduct.component.html",
  styleUrls: []
})
export class addproduct implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("addproduct");
  }
  //ngOnInit() { }

  product: any = {};
  specification: any = {};
  httpresponse: any = null;
  httpresponseTotal: any;
  insertSellerProductErr: any;
  httpresponse1: any = null;
  httpresponse1Total: any;
  insertSellerProductSpecificationErr: any;
  httpresponse12: any = null;
  httpresponse12Total: any;
  insertSellerProductErr1: any;
  httpresponse123: any = null;
  httpresponse123Total: any;
  insertSellerProductSpecificationErr1: any;
  ngOnInit() {}

  /*
   *insert
   */

  insert() {
    this.api
      .insertSellerProduct(this.product)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (httpresponse: any) => {
          if (httpresponse && httpresponse.results != null) {
            this.httpresponse12 = httpresponse.results;
          } else {
            this.httpresponse12 = httpresponse;
          }
        },
        error: (insertSellerProductErr: any) => {
          this.insertSellerProductErr1 = insertSellerProductErr;
        }
      });
    this.api
      .insertSellerProductSpecification(this.specification)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (httpresponse: any) => {
          if (httpresponse && httpresponse.results != null) {
            this.httpresponse123 = httpresponse.results;
          } else {
            this.httpresponse123 = httpresponse;
          }
        },
        error: (insertSellerProductSpecificationErr: any) => {
          this.insertSellerProductSpecificationErr1 = insertSellerProductSpecificationErr;
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
