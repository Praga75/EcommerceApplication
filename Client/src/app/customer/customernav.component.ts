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
  selector: "customernav",
  templateUrl: "./customernav.component.html",
  styleUrls: []
})
export class customernav implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("customernav");
  }
  //ngOnInit() { }

  sellerProduct: any = null;
  sellerProductTotal: any;
  selectSellerProductByID76501Err: any;
  searchingResponseList: any = [];
  searchingResponseListTotal: any;
  searchingErr: any;
  searchingResponseListSelectedItem: any = null;
  searchingResponseListSelectedItems: any = [];
  searchingResponseListFilters: any = {};
  ngOnInit() {}

  /*
   *searchingData
   */

  searchingData() {
    this.api
      .searching(null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (searchingResponseList: any) => {
          if (
            searchingResponseList &&
            searchingResponseList.results != null &&
            searchingResponseList.total != null
          ) {
            this.searchingResponseList = searchingResponseList.results;
            this.searchingResponseListTotal = searchingResponseList.total;
          } else {
            this.searchingResponseList = searchingResponseList;
            this.searchingResponseListTotal = searchingResponseList.length;
          }
        },
        error: (searchingErr: any) => {
          this.searchingErr = searchingErr;
        }
      });
  }

  /*
   *productlistfun
   */

  productlistfun() {
    var queryStrings = {};
    this.dewService.navigateToPage("/productlist", queryStrings);
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
