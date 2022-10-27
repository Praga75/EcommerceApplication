import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DewAuthService } from './auth.service';
import { tap } from 'rxjs/operators';
import { DewService } from '@services/dew.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: DewAuthService,
    private dewService: DewService,
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `${this.authService.authToken}`
      }
    });

    return next.handle(request).pipe(

      tap((evt) => {
        if (evt instanceof HttpResponse) {
          if (evt.body && evt.body.success) {
            // Handle Success Toasts
            // console.log(evt.body.success.msg, evt.body.success.title);
          }
        }
      }),
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          try {
            if (!navigator.onLine) {
              // Handle offline error
              this.dewService.showSnackBar(`No Internet Connection`, 'Ok', 5000);
            }
            else if (err.status && err.status) {
              if (err.statusText) {
                this.dewService.showSnackBar(`${err.statusText}`, 'Ok', 5000);
              } else {
                this.dewService.showSnackBar(`An error occurred with status ${err.status}`, 'Ok', 5000);
              }
            }

          } catch (e) {
            console.error('An error occurred', '');
            this.dewService.showSnackBar('An error occurred...', 'Ok', 5000);
          }
          //log error
        }
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.authService.logout('');
          location.reload();
        }
        // const error = err.error.message || err.statusText;
        return throwError(err);
      }))
  }

}
