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
  templateUrl: "./buynow.component.html",
  styleUrls: []
})
@Injectable()
export class buynow implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  orderdetails: any = {};
  ngOnInit() {}

  //    this.orderdetails;

  constructor(
    private dialogRef: MatDialogRef<buynow>,
    @Inject(MAT_DIALOG_DATA) public data,

    private route: ActivatedRoute,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private mainService: MainService
  ) {
    this.orderdetails = {};
    if (this.data["orderdetails"]) {
      this.orderdetails = this.data["orderdetails"];
    }
  }
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
