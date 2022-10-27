import { Directive, Input } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms'
import { from, Observable } from 'rxjs';
import { MainService } from '@services/main.services'
import { map } from 'rxjs/operators';

export function uniqueEmailValidator(mainService: MainService): AsyncValidatorFn {
    return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return mainService.getApplicationUserbyEmail(c.value).pipe(
            map((users: any) => {
                return users && users.length > 0 ? { 'uniqueUser': true } : null;
            })
        )
    }
}

@Directive({
    selector: '[emailUnique]',
    providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: EmailUniqueDirective, multi: true }]
})
export class EmailUniqueDirective implements AsyncValidator {
    constructor(
        public mainService: MainService
    ) { }

    validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return this.mainService.getApplicationUserbyEmail(c.value)
            .pipe(
                map((users: any) => {
                    return users && users.length > 0 ? { 'uniqueUser': true } : null;
                })
            )

    }
}