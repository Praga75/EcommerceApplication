import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
// import { User } from '../../interfaces/user';
// import { ApiResult } from '../../interfaces/api-result';

@Component({
    selector: 'dew-datatable',
    templateUrl: './dew-datatable.component.html',
    styleUrls: ['./dew-datatable.component.css']
})
export class DewDataTableComponent implements OnInit {
    dtTrigger;
    dtOptions;
    @Output() dataSourceRefresh = new EventEmitter<any>();
    @Output() selectedItemChanged = new EventEmitter<any>();
    @Output() rowEdited = new EventEmitter<any>();
    @Output() rowAdded = new EventEmitter<any>();
    @Input() gridProperties: any;
    @Input() dataSource: any;
    @Input() dataSourceFilters: any;

    constructor() { }

    fetchData() {
        this.dataSourceRefresh.emit();
    }

    ngOnInit() {
    }
}
