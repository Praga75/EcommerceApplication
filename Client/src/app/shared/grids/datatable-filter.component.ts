import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
    selector: 'datatable-filter',
    templateUrl: './datatable-filter.component.html',
})
export class DataTableFilterComponent {

    @Output() onSearch = new EventEmitter<any>();
    @Input() filter: any;
    @Input() condition: any;

    constructor(private elRef: ElementRef) { }

    filterTypeChanged(filterType) {
        this.condition = filterType;
    }

    ngAfterViewInit() {
        var input = this.elRef.nativeElement.querySelector('input');
        fromEvent(input, 'keyup')
            .pipe(
                debounceTime(150),
                distinctUntilChanged(),
                tap(() => {
                    this.onSearch.emit();
                })
            )
            .subscribe();
    }
}