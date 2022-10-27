import {
  Component,
  Injectable,
  Inject,
  EventEmitter,
  Output,
  Input,
  OnInit,
  OnDestroy
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DewService } from "@services/dew.service";
import { DewAuthService } from "../authentication/auth.service";
import { MainService } from "@services/main.services";
import { ApiService } from "@services/api.services";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import * as _ from "lodash";

import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  templateUrl: "./addproduct.component.html",
  styleUrls: []
})
@Injectable()
export class addproduct implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  httpresponse: any = null;
  httpresponseTotal: any;
  insertSellerProductErr: any;
  httpresponse1: any = null;
  httpresponse1Total: any;
  insertSellerProductSpecificationErr: any;
  addProductt: any = {};
  addSpecification: any = {};
  ngOnInit() {}

  /*
   *insertData
   */

  insertData() {
    this.api
      .insertSellerProduct(this.addProductt)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (httpresponse: any) => {
          if (httpresponse && httpresponse.results != null) {
            this.httpresponse = httpresponse.results;
          } else {
            this.httpresponse = httpresponse;
          }
        },
        error: (insertSellerProductErr: any) => {
          this.insertSellerProductErr = insertSellerProductErr;
        }
      });
    this.api
      .insertSellerProductSpecification(this.addSpecification)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (httpresponse: any) => {
          if (httpresponse && httpresponse.results != null) {
            this.httpresponse1 = httpresponse.results;
          } else {
            this.httpresponse1 = httpresponse;
          }
        },
        error: (insertSellerProductSpecificationErr: any) => {
          this.insertSellerProductSpecificationErr = insertSellerProductSpecificationErr;
        }
      });
  }

  constructor(
    private dialogRef: MatDialogRef<addproduct>,
    @Inject(MAT_DIALOG_DATA) public data,

    private route: ActivatedRoute,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private mainService: MainService
  ) {}
  ok() {
    this.dialogRef.close();
  }
  cancel() {
    this.dialogRef.close();
  }
  //ngOnInit() { }
  //prefix and dependency injection will be passed to custom code function/script.
  //custom code function should start with prefix  (Ex. generate() {})

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next();
    this.destroy$.complete();
  }
}
