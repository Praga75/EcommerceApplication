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
  selector: "admin",
  templateUrl: "./admin.component.html",
  styleUrls: []
})
export class admin implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("admin");
  }
  //ngOnInit() { }

  notverifyproductResponseList: any = [];
  notverifyproductResponseListTotal: any;
  notverifyproductErr: any;
  ngOnInit() {}

  /*
   *notver
   */

  notver() {
    this.api
      .notverifyproduct()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notverifyproductResponseList: any) => {
          if (
            notverifyproductResponseList &&
            notverifyproductResponseList.results != null &&
            notverifyproductResponseList.total != null
          ) {
            this.notverifyproductResponseList =
              notverifyproductResponseList.results;
            this.notverifyproductResponseListTotal =
              notverifyproductResponseList.total;
          } else {
            this.notverifyproductResponseList = notverifyproductResponseList;
            this.notverifyproductResponseListTotal =
              notverifyproductResponseList.length;
          }
        },
        error: (notverifyproductErr: any) => {
          this.notverifyproductErr = notverifyproductErr;
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
