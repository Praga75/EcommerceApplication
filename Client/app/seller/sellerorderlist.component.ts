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

  productConfirmationbySellerResponseList: any = [];
  productConfirmationbySellerResponseListTotal: any;
  productConfirmationbySellerErr: any;
  productConfirmationbySellerResponseListSelectedItem: any = null;
  productConfirmationbySellerResponseListSelectedItems: any = [];
  productConfirmationbySellerResponseListFilters: any = {};
  ngOnInit() {
    this.sellerorderStatus();
  }

  /*
   *sellerorderStatus
   */

  sellerorderStatus() {
    this.api
      .productConfirmationbySeller(26, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (productConfirmationbySellerResponseList: any) => {
          if (
            productConfirmationbySellerResponseList &&
            productConfirmationbySellerResponseList.results != null &&
            productConfirmationbySellerResponseList.total != null
          ) {
            this.productConfirmationbySellerResponseList =
              productConfirmationbySellerResponseList.results;
            this.productConfirmationbySellerResponseListTotal =
              productConfirmationbySellerResponseList.total;
          } else {
            this.productConfirmationbySellerResponseList = productConfirmationbySellerResponseList;
            this.productConfirmationbySellerResponseListTotal =
              productConfirmationbySellerResponseList.length;
          }
        },
        error: (productConfirmationbySellerErr: any) => {
          this.productConfirmationbySellerErr = productConfirmationbySellerErr;
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
