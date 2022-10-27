import { Component } from '@angular/core';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    title = 'app';
    queryStrings: any = null;
    constructor() {
    }

    ngOnInit() {
    }

    goBackSingle = function () {
        window.history.back();
    };
}
