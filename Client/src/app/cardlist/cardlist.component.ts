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
  selector: "cardlist",
  templateUrl: "./cardlist.component.html",
  styleUrls: []
})
export class cardlist implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private route: ActivatedRoute,

    private mainService: MainService,
    private dewService: DewService,
    private authService: DewAuthService,
    private api: ApiService,
    private titleService: Title
  ) {
    this.titleService.setTitle("cardlist");
  }
  //ngOnInit() { }

  RichCardAddToCard: any = null;
  RichCardAddToCardTotal: any;
  selectRichCardAddToCardByIDErr: any;
  RichCardAddToCardSelectedItem: any = null;
  RichCardAddToCardSelectedItems: any = [];
  RichCardAddToCardFilters: any = {};
  addtocardlistResponse: any = null;
  addtocardlistResponseTotal: any;
  addtocardlistErr: any;
  ngOnInit() {
    this.details();
  }

  /*
   *cardData
   */

  cardData() {
    this.api
      .selectRichCardAddToCardByID(this.RichCardAddToCard.cardid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (RichCardAddToCard: any) => {
          if (
            RichCardAddToCard &&
            RichCardAddToCard.results != null &&
            RichCardAddToCard.total != null
          ) {
            this.RichCardAddToCard = RichCardAddToCard.results;
            this.RichCardAddToCardTotal = RichCardAddToCard.total;
          } else {
            this.RichCardAddToCard = RichCardAddToCard;
            this.RichCardAddToCardTotal = RichCardAddToCard.length;
          }
        },
        error: (selectRichCardAddToCardByIDErr: any) => {
          this.selectRichCardAddToCardByIDErr = selectRichCardAddToCardByIDErr;
        }
      });
  }

  /*
   *details
   */

  details() {
    this.api
      .addtocardlist(null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (addtocardlistResponse: any) => {
          if (
            addtocardlistResponse &&
            addtocardlistResponse.results != null &&
            addtocardlistResponse.total != null
          ) {
            this.addtocardlistResponse = addtocardlistResponse.results;
            this.addtocardlistResponseTotal = addtocardlistResponse.total;
          } else {
            this.addtocardlistResponse = addtocardlistResponse;
            this.addtocardlistResponseTotal = addtocardlistResponse.length;
          }
        },
        error: (addtocardlistErr: any) => {
          this.addtocardlistErr = addtocardlistErr;
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
