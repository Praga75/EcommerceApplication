import { Directive } from '@angular/core';
import { DewAuthService } from './auth.service';
import { DewService } from '@services/dew.service';
import { ElementRef } from '@angular/core';
import * as $ from 'jquery';
import * as _ from 'lodash';

@Directive({
    selector: '[has-permission]',
})
export class HasPermission {
    element: ElementRef = null;
    permission: String = null;
    constructor(element: ElementRef, private dewService: DewService, private authService: DewAuthService) {
        this.element = element;
    }

    ngOnInit() {
        let self = this;
        let el = this.element.nativeElement;
        this.permission = $(el).attr('has-permission');
        if (!_.isString(this.permission)) {
            throw 'has permission value must be a string';
        }
        var value = this.permission.trim();
        var notPermissionFlag = value[0] === '!'; //!edit
        if (notPermissionFlag) {
            value = value.slice(1).trim();
        }

        function toggleVisibilityBasedOnPermission() {
            self.authService.hasPermission(value, function (hasPermission) {
                if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
                    $(el).show();
                }
                else {
                    $(el).hide();
                }
            });
        }

        toggleVisibilityBasedOnPermission();
        this.dewService.permissionsChanged.subscribe(permissionList => toggleVisibilityBasedOnPermission());
    }
}