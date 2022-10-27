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
  selector: "sellerorderlist",
  templateUrl: "./sellerorderlist.component.html",
  styleUrls: []
})
export class sellerorderlist implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("sellerorderlist");
  }
  //ngOnInit() { }

  orderDetailsResponse: any = null;
  orderDetailsResponseTotal: any;
  orderDetailsErr: any;
  orderDetailsResponseSelectedItem: any = null;
  orderDetailsResponseSelectedItems: any = [];
  orderDetailsResponseFilters: any = {};
  httpresponse: any = null;
  httpresponseTotal: any;
  sellerOrderStatusErr: any;
  ngOnInit() {
    this.sellerorderStatus();
  }

  /*
   *sellerorderStatus
   */

  sellerorderStatus() {
    this.api
      .orderDetails(null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orderDetailsResponse: any) => {
          if (
            orderDetailsResponse &&
            orderDetailsResponse.results != null &&
            orderDetailsResponse.total != null
          ) {
            this.orderDetailsResponse = orderDetailsResponse.results;
            this.orderDetailsResponseTotal = orderDetailsResponse.total;
          } else {
            this.orderDetailsResponse = orderDetailsResponse;
            this.orderDetailsResponseTotal = orderDetailsResponse.length;
          }
        },
        error: (orderDetailsErr: any) => {
          this.orderDetailsErr = orderDetailsErr;
        }
      });
  }

  /*
   *updateProductDetailsFun
   */

  updateProductDetailsFun() {
    this.api
      .sellerOrderStatus(this.orderDetailsResponse)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (httpresponse: any) => {
          if (httpresponse && httpresponse.results != null) {
            this.httpresponse = httpresponse.results;
          } else {
            this.httpresponse = httpresponse;
          }
        },
        error: (sellerOrderStatusErr: any) => {
          this.sellerOrderStatusErr = sellerOrderStatusErr;
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
