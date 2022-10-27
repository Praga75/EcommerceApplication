import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DewService } from '@services/dew.service';

import * as StackTraceParser from 'error-stack-parser';

export type HandleError =
  <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

@Injectable()
export class HttpErrorHandler {

  constructor(
    private dewService: DewService,
    private injector: Injector,
  ) { }

  createHandleError = (serviceName = '') => <T>
    (operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result);

  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {

    return (error: HttpErrorResponse): Observable<T> => {

      if (error instanceof HttpErrorResponse) {

        const message = (error.error instanceof ErrorEvent) ?
          error.error.message : `server returned code ${error.status} - ${error.message} with body "${error.error}"`;

        // Server or connection error happened
        if (!navigator.onLine) {
          // Handle offline error
          this.dewService.showSnackBar(`No Internet Connection`, 'Ok', 5000);
        } else {
          // Handle Http Error (error.status === 403, 404...)
          this.dewService.showSnackBar(`${serviceName}: ${operation} failed: ${message}`, 'Ok', 5000);
        }
      } else {
        // Handle Client Error (Angular Error, ReferenceError...)     
      }
      console.error(error);
      return of(result);
    };

  }
}

