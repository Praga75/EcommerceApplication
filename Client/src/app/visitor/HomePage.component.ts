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
  selector: "HomePage",
  templateUrl: "./HomePage.component.html",
  styleUrls: []
})
export class HomePage implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("HomePage");
  }
  //ngOnInit() { }

  ProductFullDetailsResponseList: any = [];
  ProductFullDetailsResponseListTotal: any;
  ProductFullDetailsErr: any;
  ProductFullDetailsResponseListSelectedItem: any = null;
  ProductFullDetailsResponseListSelectedItems: any = [];
  ProductFullDetailsResponseListFilters: any = {};
  httpresponse: any = null;
  httpresponseTotal: any;
  insertRichCardAddToCardErr: any;
  ngOnInit() {
    this.productdata();
  }

  /*
   *productdata
   */

  productdata() {
    this.api
      .ProductFullDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ProductFullDetailsResponseList: any) => {
          if (
            ProductFullDetailsResponseList &&
            ProductFullDetailsResponseList.results != null &&
            ProductFullDetailsResponseList.total != null
          ) {
            this.ProductFullDetailsResponseList =
              ProductFullDetailsResponseList.results;
            this.ProductFullDetailsResponseListTotal =
              ProductFullDetailsResponseList.total;
          } else {
            this.ProductFullDetailsResponseList = ProductFullDetailsResponseList;
            this.ProductFullDetailsResponseListTotal =
              ProductFullDetailsResponseList.length;
          }
        },
        error: (ProductFullDetailsErr: any) => {
          this.ProductFullDetailsErr = ProductFullDetailsErr;
        }
      });
  }

  /*
   *addtocardfun
   */

  addtocardfun() {
    this.api
      .insertRichCardAddToCard(this.ProductFullDetailsResponseListSelectedItem)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (httpresponse: any) => {
          if (httpresponse && httpresponse.results != null) {
            this.httpresponse = httpresponse.results;
          } else {
            this.httpresponse = httpresponse;
          }
        },
        error: (insertRichCardAddToCardErr: any) => {
          this.insertRichCardAddToCardErr = insertRichCardAddToCardErr;
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
