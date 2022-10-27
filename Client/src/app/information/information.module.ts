import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@shared/shared.module";
import { MaterialModule } from "../material.module";
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { tacEditorComponent, tacEditorDialog } from './terms-and-conditions/tacEditor.component';
import { termsAndConditionsComponent, termsAndConditionDialog } from "./terms-and-conditions/termsAndCondition.component";
import { privacyPolicyComponent } from "./privacy-policy/privacypolicy.component";
import { cookiePolicyComponent } from "./cookie-policy/cookiepolicy.component";
import { contactKfComponent } from "./contact/contact.component"

import { InformationRoutingModule } from './information.routing';
import { QuillModule } from 'ngx-quill';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  imports: [
    InformationRoutingModule,
    SharedModule,
    MaterialModule,
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [
    termsAndConditionsComponent,
    privacyPolicyComponent,
    cookiePolicyComponent,
    termsAndConditionDialog,
    tacEditorComponent,
    contactKfComponent,
    tacEditorDialog,
  ],
  exports: [
    termsAndConditionsComponent,
    privacyPolicyComponent,
    cookiePolicyComponent,
    termsAndConditionDialog,
    tacEditorComponent,
    contactKfComponent,
    tacEditorDialog,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => tacEditorDialog),
    }
  ]
})
export class InformationModule { }
