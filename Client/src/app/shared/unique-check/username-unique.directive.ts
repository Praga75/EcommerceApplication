import { Directive, Input } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms'
import { from, Observable } from 'rxjs';
import { MainService } from '@services/main.services'
import { map } from 'rxjs/operators';

export function uniqueUserNameValidator(mainService: MainService): AsyncValidatorFn {
    return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return mainService.getApplicationUserbyUserName(c.value).pipe(
            map((users: any) => {
                return users && users.length > 0 ? { 'uniqueUser': true } : null;
            })
        )
    }
}

@Directive({
    selector: '[usernameUnique]',
    providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UsernameUniqueDirective, multi: true }]
})
export class UsernameUniqueDirective implements AsyncValidator {
    constructor(
        public mainService: MainService
    ) { }

    validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return this.mainService.getApplicationUserbyUserName(c.value)
            .pipe(
                map((users: any) => {
                    return users && users.length > 0 ? { 'uniqueUser': true } : null;
                })
            )

    }
}