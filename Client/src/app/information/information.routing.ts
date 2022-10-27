import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/auth.guard';

import { tacEditorComponent, tacEditorDialog } from './terms-and-conditions/tacEditor.component';
import { termsAndConditionsComponent, termsAndConditionDialog } from "./terms-and-conditions/termsAndCondition.component";
import { privacyPolicyComponent } from "./privacy-policy/privacypolicy.component";
import { cookiePolicyComponent } from "./cookie-policy/cookiepolicy.component";
import { contactKfComponent } from './contact/contact.component';

const routes: Routes = [
  {
    path: "termAndConditionsEditor",
    component: tacEditorComponent,
    canActivate: []
  },
  {
    path: "cookies-policy",
    component: cookiePolicyComponent,
    canActivate: [],
    data: []
  },
  {
    path: "privacy-policy",
    component: privacyPolicyComponent,
    canActivate: [],
    data: []
  },
  {
    path: "termsandconditions",
    component: termsAndConditionsComponent,
    canActivate: [],
    data: []
  },

  {
    path: "contact",
    component: contactKfComponent,
    canActivate: [],
    data: []

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationRoutingModule { }