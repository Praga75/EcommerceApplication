import { Component, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'dew-mat-pager',
    template: `<mat-paginator *ngIf="totalItem" [length]="totalItem" [pageSize]="filter.pageSize"
        (page)="triggerNewPage($event)" hidePageSize="true"></mat-paginator>`
})
export class dewMatPager {
    @Output() onPageChange = new EventEmitter<any>();
    @Input() filter: any = {};
    @Input() totalItem: any = 10;


    ngOnInit() {
        this.filter.pageSize = 10;
        this.filter.pageNumber = 0;
        this.triggerNewPage(this.filter);
    }

    triggerNewPage(event) {
        this.filter.pageSize = event.pageSize;
        this.filter.pageNumber = (event.pageNumber == 0 || event.pageNumber) ? event.pageNumber + 1 : event.pageIndex + 1;
        this.onPageChange.emit();
    }
}
