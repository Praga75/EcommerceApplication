import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { NgModule } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DewAuthService } from './authentication/auth.service';
import { ErrorInterceptor } from './authentication/error.interceptor';
import { LoginComponent } from './authentication/login.component';
import { LoginService } from './authentication/login.service';
import { ComponentsModule } from './components.module';
import { HttpErrorHandler } from './http-error-handler.service';
import { MatCardModule } from '@angular/material/card';
// import { MatFormField } from '@angular/material/form-field';
import { DewLayoutComponent } from './layouts/dew-layout.component';
import { HorizontalNavigationComponent } from './layouts/horizontal-navigation.component';
import { VerticalNavigationComponent } from './layouts/vertical-navigation.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ApiService } from '@services/api.services';
import { DewService } from '@services/dew.service';
import { MainService } from '@services/main.services';
import { ExternalService } from '@services/external.service';
import { SharedModule } from '@shared/shared.module';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';



import * as _ from 'lodash';
import * as esConfig from '../assets/externalServiceConnections.json';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
let providers: any = {};
_.each(esConfig.default, (esc: any) => {
    if (esc.authType == "OAuth2" || esc.authType == "OAuth1") {
        let providerConfig: any = {};
        _.each(esc.authParameters, function (p) {
            providerConfig[p.key] = p.value;
        });

        var oauthProvider: any = {};
        if (esc.authType == "OAuth2") {
            oauthProvider = {
                name: esc.serviceProviderName,
                clientId: providerConfig.ClientID,
                authorizationEndpoint: providerConfig.AuthorizationPath,
                redirectUri: providerConfig.CallbackUrl,
                requiredUrlParams: providerConfig.AuthorizationRequiredParams && providerConfig.AuthorizationRequiredParams.length > 0 ? providerConfig.AuthorizationRequiredParams.split(',') : [],
                optionalUrlParams: providerConfig.AuthorizationOptionalParams && providerConfig.AuthorizationOptionalParams.length > 0 ? providerConfig.AuthorizationOptionalParams.split(',') : [],
                scope: providerConfig.Scope && providerConfig.Scope.length > 0 ? providerConfig.Scope.split(',') : [],
                scopeDelimiter: providerConfig.ScopeDelimiter,
                oauthType: '2.0',
                url: providerConfig.url ? providerConfig.url : null
            };
        }
        else if (esc.authType == "OAuth1") {
            oauthProvider = {
                name: esc.serviceProviderName,
                clientId: providerConfig.ClientID,
                authorizationEndpoint: providerConfig.AuthorizationPath,
                redirectUri: providerConfig.CallbackUrl,
                oauthType: '1.0',
                url: providerConfig.url ? providerConfig.url : null
            }
        }
        if (providerConfig.DisplayType && providerConfig.DisplayType.length > 0) {
            oauthProvider.display = providerConfig.DisplayType;
        }
        if (providerConfig.PopupOptions && providerConfig.PopupOptions.length > 0) {
            oauthProvider.popupOptions = JSON.parse(providerConfig.PopupOptions);
        }
        if (providerConfig.ScopePrefix && providerConfig.ScopePrefix.length > 0) {
            oauthProvider.scopePrefix = providerConfig.ScopePrefix;
        }

        if (providerConfig.State && providerConfig.State.length > 0) {
            oauthProvider.state = providerConfig.State;
        }
        else if (providerConfig.AuthorizationPath && providerConfig.AuthorizationPath.indexOf('.google.') > 0) {
            oauthProvider.state = function () {
                return encodeURIComponent(Math.random().toString(36).substr(2));
            }
        }

        oauthProvider.skipAutoCallService = true;
        providers[esc.serviceProviderName] = oauthProvider;
    }
});


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelSpeed: 2,
    wheelPropagation: true,
    minScrollbarLength: 20
};


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NavigationComponent,
        DewLayoutComponent,
        HorizontalNavigationComponent,
        VerticalNavigationComponent,
    ],
    entryComponents: [
        // MatSpinner
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        ComponentsModule,
        SharedModule,
        HttpClientModule,
        PerfectScrollbarModule,
        NgHttpLoaderModule,
        MatProgressSpinnerModule,
        MatCardModule,
        
    ],
    providers: [
        CookieService,
        DewService,
        MainService,
        ApiService,
        ExternalService,
        LoginService,
        DewAuthService,
        HttpErrorHandler,
        Title,
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        
    ],
    bootstrap: [AppComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ],
})
export class AppModule { }
