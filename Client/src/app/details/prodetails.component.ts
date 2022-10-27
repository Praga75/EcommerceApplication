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
  selector: "prodetails",
  templateUrl: "./prodetails.component.html",
  styleUrls: []
})
export class prodetails implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

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
  //prefix and dependency injection will be passed to custom code function/script.
  //custom code function should start with prefix  (Ex. generate() {})

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next();
    this.destroy$.complete();
  }
}
