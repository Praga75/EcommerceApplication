import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Operation } from '@interfaces/user';
import { ApiResult } from '@interfaces/api-result';
import { MainService } from '@services/main.services';

@Component({
  selector: 'app-operations-list',
  templateUrl: './operations-list.component.html',
  styleUrls: ['./operations-list.component.css']
})
export class OperationsListComponent implements OnInit {

  @Output() onSelectOperation = new EventEmitter<Operation>();
  operationList: any;
  operationListFilters: any = {};
  operationListTotal: number;

  constructor(public mainService: MainService) { }

  emitSelectedOperation(operation: Operation) {
    this.onSelectOperation.emit(operation);
  }

  ngOnInit() {
  }

  getOperations() {
    this.mainService.getOperations(this.operationListFilters)
      .subscribe({
        next: (data: ApiResult) => {
          if (data && data.results && data.results.length > 0) {
            this.operationList = data.results;
            this.operationListTotal = data.total;
          } else if (data) {
            this.operationList = data;
            this.operationListTotal = data.total;
          }
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  pageChange() {
    this.getOperations();
  }
}
