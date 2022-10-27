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
  selector: "sellerlogin",
  templateUrl: "./sellerlogin.component.html",
  styleUrls: []
})
export class sellerlogin implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("sellerlogin");
  }
  //ngOnInit() { }

  login: any = {};
  sellerProduct: any = null;
  sellerProductTotal: any;
  selectSellerProductByIDErr: any;
  SellerDetails: any = null;
  SellerDetailsTotal: any;
  selectSellerDetailsByIDErr: any;
  ngOnInit() {}

  /*
   *loginfun
   */

  loginfun() {
    this.api
      .selectSellerDetailsByID(this.login.Email, this.login.Password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (SellerDetails: any) => {
          if (
            SellerDetails &&
            SellerDetails.results != null &&
            SellerDetails.total != null
          ) {
            this.SellerDetails = SellerDetails.results;
            this.SellerDetailsTotal = SellerDetails.total;
          } else {
            this.SellerDetails = SellerDetails;
            this.SellerDetailsTotal = SellerDetails.length;
          }

          var queryStrings = {};
          this.dewService.navigateToPage("/addproduct", queryStrings);
        },
        error: (selectSellerDetailsByIDErr: any) => {
          this.selectSellerDetailsByIDErr = selectSellerDetailsByIDErr;
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
