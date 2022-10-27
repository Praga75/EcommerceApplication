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

import { buynow } from "../customer/buynow.component";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";

@Component({
  selector: "prodetails",
  templateUrl: "./prodetails.component.html",
  styleUrls: []
})
export class prodetails implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("prodetails");
  }
  //ngOnInit() { }

  @Input() product: any = {};
  databyidResponseList: any = [];
  databyidResponseListTotal: any;
  databyidErr: any;
  databyidResponseListSelectedItem: any = null;
  databyidResponseListSelectedItems: any = [];
  databyidResponseListFilters: any = {};
  databyidResponseList1: any = [];
  databyidResponseList1Total: any;
  databyidErr1: any;
  prodetailbyidResponseList: any = [];
  prodetailbyidResponseListTotal: any;
  prodetailbyidErr: any;
  ngOnInit() {}

  /*
   *takeid
   */

  takeid() {
    this.api
      .databyid(this.product.productid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (databyidResponseList: any) => {
          if (
            databyidResponseList &&
            databyidResponseList.results != null &&
            databyidResponseList.total != null
          ) {
            this.databyidResponseList = databyidResponseList.results;
            this.databyidResponseListTotal = databyidResponseList.total;
          } else {
            this.databyidResponseList = databyidResponseList;
            this.databyidResponseListTotal = databyidResponseList.length;
          }
        },
        error: (databyidErr: any) => {
          this.databyidErr = databyidErr;
        }
      });
  }
  buynow(orderdetails) {
    var params: any = {};

    params.orderdetails = orderdetails;

    const modal = this.dialog.open(buynow, {
      width: "300px",
      data: params
    });

    modal.afterClosed().subscribe(() => {});
  }

  /*
   *orderfun
   */

  orderfun() {
    this.buynow(this.databyidResponseListSelectedItem);
  }

  /*
   *sendfullid
   */

  sendfullid() {
    this.api
      .prodetailbyid(null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prodetailbyidResponseList: any) => {
          if (
            prodetailbyidResponseList &&
            prodetailbyidResponseList.results != null &&
            prodetailbyidResponseList.total != null
          ) {
            this.prodetailbyidResponseList = prodetailbyidResponseList.results;
            this.prodetailbyidResponseListTotal =
              prodetailbyidResponseList.total;
          } else {
            this.prodetailbyidResponseList = prodetailbyidResponseList;
            this.prodetailbyidResponseListTotal =
              prodetailbyidResponseList.length;
          }
        },
        error: (prodetailbyidErr: any) => {
          this.prodetailbyidErr = prodetailbyidErr;
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
