import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MainService } from '@services/main.services';
import { Document } from '@interfaces/user';
import { ApiResult } from '@interfaces/api-result';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'
import { AddDocumentDialog } from '@shared/document-details/document-details.component';
import { DocumentListComponent } from '@shared/document-list/document-list.component';
import { DocumentDetailsComponent } from '@shared/document-details/document-details.component';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-manage-documents',
  templateUrl: './manage-documents.component.html',
  providers: [MainService]

})
export class ManageDocumentsComponent implements OnInit {
  public document: Document = [];
  selectedDocument: Document = null;
  detailedView: boolean = false;
  listView: boolean = true;
  noItem: String;
  mobileQuery: MediaQueryList;
  selectedUser: any;
  _mobileQueryListener: () => void;

  @ViewChild(DocumentListComponent, { static: false }) private documentList: DocumentListComponent;
  @ViewChild(DocumentDetailsComponent, { static: false }) private documentDetail: DocumentDetailsComponent;

  constructor(public mainService: MainService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private titleService: Title,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.titleService.setTitle("Manage Documents");
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit() {
    this.noItem = "Documents";
  }

  onSelect(document: Document): void {
    this.selectedDocument = document;
    this.showDetailedView();
  }

  showDetailedView() {
    this.detailedView = true;
  }

  backToListView() {
    this.detailedView = false;
  }

  onEdit(document: Document): void {
    this.documentList.getDocuments();
    this.onSelect(document);
    this.documentDetail.getUserDoc(document);
  }

  onDelete(document: Document) {
    this.selectedDocument = null;
    this.documentList.getDocuments();
  }




  addDocument() {
    const addDialog = this.dialog.open(AddDocumentDialog, {
      width: "300px",
      disableClose: true,
      data: {
        ModuleName: "Documents"
      }
    });

    addDialog.afterClosed().subscribe(document => {
      if (document) {
        this.mainService.insertDocument(document)
          .subscribe({
            next: (resp) => {
              this.snackBar.open("Successfully Added", "OK", {
                duration: 2000,
              });
              this.documentList.getDocuments();
            },
            error: (error) => {
              console.log("Error", error);
            }, 
            complete: () => { }
          });
      } else {
        console.log("Add Document cancelled");
      }
    });
  }

}
