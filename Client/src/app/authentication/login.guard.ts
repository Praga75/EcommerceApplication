import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DewAuthService } from './auth.service';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    constructor(private router: Router, private authService: DewAuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return new Observable((observer) => {
            this.authService.loadUserCredentials(() => {
                if (!this.authService.currentUser) {
                    observer.next(true);
                }
                else {
                    observer.next(false);
                }
            })
        });
    }
}