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
  selector: "products",
  templateUrl: "./products.component.html",
  styleUrls: []
})
export class products implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("products");
  }
  //ngOnInit() { }

  notverifiedResponseList: any = [];
  notverifiedResponseListTotal: any;
  variedErr: any;
  notverifiedResponseListSelectedItem: any = null;
  notverifiedResponseListSelectedItems: any = [];
  notverifiedResponseListFilters: any = {};
  notverifiedResponseList1: any = [];
  notverifiedResponseList1Total: any;
  variedErr1: any;
  productDetailsResponseList: any = [];
  productDetailsResponseListTotal: any;
  productDetailsErr: any;
  productDetailsResponseList1: any = [];
  productDetailsResponseList1Total: any;
  productDetailsErr1: any;
  ngOnInit() {
    this.product();
  }

  /*
   *product
   */

  product() {
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
    this.api
      .productDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (productDetailsResponseList: any) => {
          if (
            productDetailsResponseList &&
            productDetailsResponseList.results != null &&
            productDetailsResponseList.total != null
          ) {
            this.productDetailsResponseList1 =
              productDetailsResponseList.results;
            this.productDetailsResponseList1Total =
              productDetailsResponseList.total;
          } else {
            this.productDetailsResponseList1 = productDetailsResponseList;
            this.productDetailsResponseList1Total =
              productDetailsResponseList.length;
          }
        },
        error: (productDetailsErr: any) => {
          this.productDetailsErr1 = productDetailsErr;
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
