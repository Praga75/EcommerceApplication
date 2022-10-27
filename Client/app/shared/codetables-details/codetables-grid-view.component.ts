import {
  Component,
  Injectable,
  Output,
  EventEmitter,
  Input,
  ViewChild
} from "@angular/core";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import * as _ from "lodash";

@Component({
  selector: "codetables-grid-view",
  templateUrl: "./codetables-grid-view.component.html"
})
@Injectable()
export class CodeTablesGridView {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;
  //dtTrigger: Subject = new Subject();
  @Output()
  dataSourceRefresh = new EventEmitter<any>();
  @Output()
  selectedItemChanged = new EventEmitter<any>();
  @Output()
  rowEdited = new EventEmitter<any>();
  @Output()
  rowAdded = new EventEmitter<any>();
  @Input()
  dataSourceParameters: any = {};

  filters: any = {
    userId: {
      fieldName: "userId",
      condition: "EXACT",
      term: null
    },

    userName: {
      fieldName: "userName",
      condition: "EXACT",
      term: null
    },

    firstName: {
      fieldName: "firstName",
      condition: "EXACT",
      term: null
    },

    lastName: {
      fieldName: "lastName",
      condition: "EXACT",
      term: null
    },

    email: {
      fieldName: "email",
      condition: "EXACT",
      term: null
    },

    password: {
      fieldName: "password",
      condition: "EXACT",
      term: null
    },

    displayName: {
      fieldName: "displayName",
      condition: "EXACT",
      term: null
    }
  };

  dataSourceCallback: any = null;
  dtOptions: any = {
    paging: true,
    ordering: true,
    searching: true,
    pagingType: "full_numbers",
    pagingLength: 20,
    serverSide: true,
    processing: true,
    select: {
      items: "row",
      style: "single"
    },
    ajax: (dataTablesParameters: any, callback) => {
      this.dataSourceCallback = callback;
      this.fetchData(dataTablesParameters);
    }
  };

  @Input()
  recordsTotal: number = 0;
  @Input()
  recordsFiltered: any = {};

  _dataSource: any;
  @Input()
  set dataSource(value: any) {
    this._dataSource = value;
    if (this.dataSourceCallback) {
      this.dataSourceCallback({
        recordsTotal: this.recordsFiltered, //previous total
        recordsFiltered: this.recordsTotal, //current total
        data: []
      });
    }
    //datatableElement.dtInstance.then((dtInstance: DataTables.Api) => console.log(dtInstance));
    //this.dtTrigger.next();
  }
  get dataSource() {
    return this._dataSource;
  }

  constructor() { }

  fetchData(args) {
    let serverSidefilters = [];
    _.each(this.filters, (filter, l) => {
      if (filter.term && filter.term.length > 0) {
        serverSidefilters.push({
          fieldName: filter.fieldName,
          condition: filter.condition,
          term: filter.term
        });
      }
    });

    if (args) {
      let order = args.order;
      let sorts = [];
      if (order && order.length > 0) {
        _.each(order, sortColumn => {
          sorts.push({
            column: sortColumn.column,
            fieldName: args.columns[sortColumn.column].name,
            order: sortColumn.dir
          });
        });
      }
      this.dataSourceParameters.pageSize = args.length;
      this.dataSourceParameters.pageNumber =
        args.start / this.dataSourceParameters.pageSize + 1; // (gridProperties.pageNumber - 1) * pageSize;
      // this.dataSourceParameters.sortColumns = sorts;
    }
    this.dataSourceParameters.filters = serverSidefilters;
    this.dataSourceRefresh.emit();
  }

  triggerAjaxCall() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  filterChanged() {
    this.dataSourceParameters.pageNumber = 1;
    this.triggerAjaxCall();
  }

  dtInstanceCallback(dtInstance) {
    dtInstance.DataTable.on("page.dt", () => {
      let info = dtInstance.page.info();
      this.dataSourceParameters.pageNumber = info.page;
      this.dataSourceParameters.pageSize = info.length;
      this.triggerAjaxCall();
    });
    dtInstance.DataTable.on("order.dt", () => {
      let order = dtInstance.order();

      let sorts = [];
      _.each(order, sortColumn => {
        sorts.push({
          fieldName: sortColumn[0],
          order: sortColumn[1]
        });
      });
      this.dataSourceParameters.pageNumber = 1;
      this.dataSourceParameters.sortColumns = sorts;
      this.triggerAjaxCall();
    });
    //dtInstance.DataTable.on('search.dt', () => { });
  }

  ngOnInit() { }

  ngOnDestroy(): void {
    //this.dtTrigger.unsubscribe();
  }
}
