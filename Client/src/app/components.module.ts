import { NgModule } from "@angular/core";
import { SharedModule } from "./shared/shared.module";

import { MaterialModule } from "./material.module";

import { HomePage } from "./visitor/HomePage.component";

import { RegistrationForCustomer } from "./customer/RegistrationForCustomer.component";

import { Login } from "./customer/Login.component";

import { navigation } from "./nav/navigation.component";

import { sellerRegistraion } from "./saller/sellerRegistraion.component";

import { sellersignup } from "./sellersignup/sellersignup.component";

import { login } from "./sellersignup/login.component";

import { product } from "./product/product.component";

import { productadd } from "./saller/productadd.component";

import { mee } from "./mee/mee.component";

import { products } from "./products/products.component";

import { customer } from "./customer/customer.component";

import { customerlogin } from "./customer/customerlogin.component";

import { customernav } from "./customer/customernav.component";

import { PRODUCTLIST } from "./productlist/PRODUCTLIST.component";

import { cardlist } from "./cardlist/cardlist.component";

import { prodetails } from "./prodetails/prodetails.component";

import { buynow } from "./customer/buynow.component";

import { sellerorderlist } from "./sellerorderlist/sellerorderlist.component";

@NgModule({
  declarations: [
    HomePage,

    RegistrationForCustomer,

    Login,

    navigation,

    sellerRegistraion,

    sellersignup,

    login,

    product,

    productadd,

    mee,

    products,

    customer,

    customerlogin,

    customernav,

    PRODUCTLIST,

    cardlist,

    prodetails,

    buynow,

    sellerorderlist
  ],
  imports: [SharedModule, MaterialModule],
  entryComponents: [
    RegistrationForCustomer,

    Login,

    sellerRegistraion,

    productadd,

    buynow
  ],
  providers: []
})
export class ComponentsModule {}
