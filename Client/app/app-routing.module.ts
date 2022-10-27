import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./authentication/login.component";
import { AuthGuard } from "./authentication/auth.guard";
import { LoginGuard } from "./authentication/login.guard";
import { ForgotComponent } from "./shared/forgot/forgot.component";
import { RegisterComponent } from "./shared/register/register.component";

import { ManageUsersComponent } from "./manage-users/manage-users.component";
import { ManageRolesComponent } from "./manage-roles/manage-roles.component";
import { ManageEntitiesComponent } from "./manage-entities/manage-entities.component";
import { ManageOperationsComponent } from "./manage-operations/manage-operations.component";
import { ManageCodetablesComponent } from "./manage-codetables/manage-codetables.component";
import { ManageDocumentsComponent } from "./manage-documents/manage-documentss.component";
import { MyProfileComponent } from "./shared/my-profile/my-profile.component";

import { HomePage } from "./visitor/HomePage.component";

import { navigation } from "./nav/navigation.component";

import { sellersignup } from "./sellersignup/sellersignup.component";

import { login } from "./sellersignup/login.component";

import { product } from "./product/product.component";

import { mee } from "./mee/mee.component";

import { products } from "./products/products.component";

import { customer } from "./customer/customer.component";

import { customerlogin } from "./customer/customerlogin.component";

import { customernav } from "./customer/customernav.component";

import { PRODUCTLIST } from "./productlist/PRODUCTLIST.component";

import { cardlist } from "./cardlist/cardlist.component";

import { prodetails } from "./prodetails/prodetails.component";

import { sellerorderlist } from "./sellerorderlist/sellerorderlist.component";

const appRoutes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: "forgotpassword",
    component: ForgotComponent,
    canActivate: []
  },

  {
    path: "register",
    component: RegisterComponent,
    canActivate: []
  },

  {
    path: "manageUsers",
    component: ManageUsersComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "manageRoles",
    component: ManageRolesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "manageOperation",
    component: ManageOperationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "manageEntities",
    component: ManageEntitiesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "manageCodetables",
    component: ManageCodetablesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "manageDocuments",
    component: ManageDocumentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "profile",
    component: MyProfileComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "",
    component: HomePage,

    canActivate: [],

    data: []
  },

  {
    path: "home",
    component: HomePage,

    canActivate: [],

    data: []
  },

  {
    path: "",
    component: sellersignup,

    canActivate: [],

    data: []
  },

  {
    path: "sellersignup",
    component: sellersignup,

    canActivate: [],

    data: []
  },

  {
    path: "slogin",
    component: login,

    canActivate: [],

    data: []
  },

  {
    path: "",
    component: product,

    canActivate: [],

    data: []
  },

  {
    path: "addproduct",
    component: product,

    canActivate: [],

    data: []
  },

  {
    path: "",
    component: mee,

    canActivate: [],

    data: []
  },

  {
    path: "mee",
    component: mee,

    canActivate: [],

    data: []
  },

  {
    path: "",
    component: products,

    canActivate: [],

    data: []
  },

  {
    path: "product",
    component: products,

    canActivate: [],

    data: []
  },

  {
    path: "",
    component: customer,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "customer",
    component: customer,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "",
    component: customerlogin,

    canActivate: [],

    data: []
  },

  {
    path: "customerloginpage",
    component: customerlogin,

    canActivate: [],

    data: []
  },

  {
    path: "customernav",
    component: customernav,

    canActivate: [],

    data: []
  },

  {
    path: "productlist",
    component: PRODUCTLIST,

    canActivate: [],

    data: []
  },

  {
    path: "cardlist",
    component: cardlist,

    canActivate: [],

    data: []
  },

  {
    path: "prodetails",
    component: prodetails,

    canActivate: [],

    data: []
  },

  {
    path: "",
    component: sellerorderlist,

    canActivate: [],

    data: []
  },

  {
    path: "sellerorderlist",
    component: sellerorderlist,

    canActivate: [],

    data: []
  },

  {
    path: "HomePage",
    component: HomePage,

    canActivate: [],

    data: []
  },

  {
    path: "navigation",
    component: navigation,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "sellersignup",
    component: sellersignup,

    canActivate: [],

    data: []
  },

  {
    path: "login",
    component: login,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "product",
    component: product,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "mee",
    component: mee,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "products",
    component: products,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "customer",
    component: customer,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "customerlogin",
    component: customerlogin,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "customernav",
    component: customernav,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "PRODUCTLIST",
    component: PRODUCTLIST,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "cardlist",
    component: cardlist,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "prodetails",
    component: prodetails,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "sellerorderlist",
    component: sellerorderlist,

    canActivate: [AuthGuard],

    data: []
  },

  {
    path: "**",
    component: sellerorderlist,

    canActivate: [AuthGuard],

    data: []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
