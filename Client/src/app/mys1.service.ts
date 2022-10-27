import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Mys1Service {
data:any={};
  constructor() { }
  takeid(id:number)
  {
    this.data=id;
    alert(this.data)

  }
  sendid()
  {
    return this.data;
  }
}
// .orWhere('sellerProduct.brand', '=', searchingData)
// .orWhere('SellerProductSpecification.productName', '=', searchingData)




//  <mat-form-field id="item13" >
// <input id="item14" matInput [(ngModel)]="data" placeholder="Search" (ngModelChange)="searchingData()" />
// </mat-form-field>






/*

          <div id="item15" style="min-height:30px" fxFlex.gt-sm="50" fxFlex="100">
            <mat-card
              id="item16"
              *ngFor="
                let searchingResponseListItem of searchingResponseList;
                let i = index
              "
              (click)="searchingResponseListSelectedItem = searchingResponseListItem"
            >
              <mat-card-title id="item17" fxLayout="row">
                <span id="item18">{{ searchingResponseListItem.brand }}</span>
                <span id="item19" fxFlex>{{ searchingResponseListItem.category }}</span>
                <span id="item20" class=" mat-text-primary">
                  {{ searchingResponseListItem.price }}
                </span>
              </mat-card-title>
              <mat-card-actions id="item22">
                <img
                  id="item30"
                  [src]="searchingResponseListItem.image"
                  style="width:400px"
                />
                <h1 id="item32">{{ searchingResponseListItem.totalsale }}</h1>
                <div id="item23" fxLayout="row">
                  <button id="item24" mat-icon-button>
                    <mat-icon id="item25">share</mat-icon>
                  </button>
                  <button id="item26" mat-icon-button>
                    <mat-icon id="item27">favorite</mat-icon>
                  </button>
                  <span id="item28" fxFlex></span>
                  <button id="item29" mat-raised-button color="warn">
                    Add to cart
                  </button>
                </div>
              </mat-card-actions>
            </mat-card>
          </div>
*/