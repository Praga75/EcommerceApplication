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
  selector: "customerlogin",
  templateUrl: "./customerlogin.component.html",
  styleUrls: []
})
export class customerlogin implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("customerlogin");
  }
  //ngOnInit() { }

  RichCardCustomerDetails: any = {};
  RichCardCustomerDetailsTotal: any;
  selectRichCardCustomerDetailsByIDErr: any;
  ngOnInit() {}

  /*
   *loginfun
   */

  loginfun() {
    this.api
      .selectRichCardCustomerDetailsByID(
        this.RichCardCustomerDetails.Email,
        this.RichCardCustomerDetails.password
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (RichCardCustomerDetails: any) => {
          if (
            RichCardCustomerDetails &&
            RichCardCustomerDetails.results != null &&
            RichCardCustomerDetails.total != null
          ) {
            this.RichCardCustomerDetails = RichCardCustomerDetails.results;
            this.RichCardCustomerDetailsTotal = RichCardCustomerDetails.total;
          } else {
            this.RichCardCustomerDetails = RichCardCustomerDetails;
            this.RichCardCustomerDetailsTotal = RichCardCustomerDetails.length;
          }

          var queryStrings = {};
          this.dewService.navigateToPage("/homepage", queryStrings);
        },
        error: (selectRichCardCustomerDetailsByIDErr: any) => {
          this.selectRichCardCustomerDetailsByIDErr = selectRichCardCustomerDetailsByIDErr;
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
