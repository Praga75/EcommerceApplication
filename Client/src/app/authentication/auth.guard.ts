import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DewAuthService } from './auth.service';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: DewAuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (state.url.indexOf('googleapis.com') > 0) {
            return new Observable((observer) => {
                observer.next(true);
            });
        }
        return new Observable((observer) => {
            this.authService.loadUserCredentials(() => {
                if (!this.authService.currentUser) {
                    // no logged user, redirect to /login 
                    if (state.url != "/login" && state.url != "/loginResponse" &&
                        state.url != "/externalLogin") {
                        if (this.authService.authProvider != "NOLOGIN") {
                            this.authService.showLogin(state.url);
                            observer.next(false);
                        }
                    }
                }
                else {
                    if (this.authService.authProvider.useDewAuthorization == true) {
                        var root: any = state.root;
                        var permission = null;
                        while (root) {
              if (root.children && root.children.length) {
                root = root.children[0];
              } else if (root.data && root.data[0] && root.data[0].permission) {
                permission = root.data[0].permission;
                break;
              } else {
                break;
              }
            }

                        if (_.isString(permission)) {
                            var self = this;
                            this.authService.hasPermission(permission, function (hasPermission) {
                                if (!hasPermission) {
                                    self.authService.showForbiddenPage();
                                    observer.next(false);
                                } else {
                                    observer.next(true);
                                }
                            });
                        }
                        else {
                            observer.next(true);
                        }
                    }
                    else {
                        observer.next(true);
                    }
                }
            })
        });
    }
}
