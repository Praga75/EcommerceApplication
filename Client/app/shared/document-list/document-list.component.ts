import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Document } from '@interfaces/user';
import { ApiResult } from '@interfaces/api-result';
import { MainService } from '@services/main.services';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
})
export class DocumentListComponent implements OnInit {

  @Output() onSelectDocument = new EventEmitter<Document>();
  documentList: any;
  documentListFilters: any = {};
  documentListTotal: number;
  getfilterdocument: any = 1;
  statusFilter: string = '1';
  iscreate: any;

  constructor(public mainService: MainService) { }

  emitSelectedUser(document: Document) {
    this.onSelectDocument.emit(document);
  }

  ngOnInit() {
  }

  getfilteremiter(statusFilter) {
    this.getfilterdocument = statusFilter;
    this.getDocuments();
  }

  getDocuments() {
    this.mainService.getDocuments('Documents', this.documentListFilters, this.getfilterdocument)
      .subscribe({
        next: (data: any) => {
          if (data && data.results && data.results.length > 0) {
            this.documentList = data.results;
            this.documentListTotal = data.total;
          } else {
            this.documentList = data;
            this.documentListTotal = data.length;
          }
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      }
        
      );
  }

  pageChange() {
    this.getDocuments();
  }

}
