import { Component, OnInit, Input, Inject, EventEmitter, Output, SimpleChanges, SimpleChange } from '@angular/core';
import { MainService } from '@services/main.services';
import { Document } from '@interfaces/user';
import { ApiResult } from '@interfaces/api-result';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '@shared/delete-confirm-dialog/delete-confirm-dialog.component'
@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
})
export class DocumentDetailsComponent implements OnInit {
  @Input() selectedDocument: any;
  @Output() onEditDocument = new EventEmitter<Document>();
  @Output() onDeleteDocument = new EventEmitter<any>();
  tempDetails: any;
  userDoc: any = '';
  data: any;
  alloweditdelete: boolean;
  constructor(
    public dialog: MatDialog,
    public mainService: MainService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    if (this.selectedDocument) {
      this.getUserDoc(this.selectedDocument);
    }

  }

  getUserDoc(selectedDocument) {
    this.userDoc = './api/downloadFile?DocId=' + selectedDocument.DocId + '&t=' + new Date().getTime();
  }

  ngOnChanges(changes: SimpleChanges) {
    const selectedDocument: SimpleChange = changes.selectedDocument;
    // console.log('prev value: ', selectedDocument.previousValue);
    // console.log('got name: ', selectedDocument.currentValue);
    this.selectedDocument = selectedDocument.currentValue;
    this.getUserDoc(this.selectedDocument);
    if (this.selectedDocument.DewDocs == 1) {
      this.alloweditdelete = true
    } else {
      this.alloweditdelete = false
    }

  }



  onEdit() {
    this.tempDetails = Object.assign({}, this.selectedDocument);
    const editDialog = this.dialog.open(EditDocumentDialog, {
      width: "300px",
      disableClose: true,
      data: this.tempDetails
    });

    editDialog.afterClosed().subscribe(result => {
      if (result) {
        this.mainService.updateDocument(result)
          .subscribe({
            next: (resp) => {
              this.snackBar.open("Successfully Updated", "OK", {
                duration: 2000,
              });
              this.userDoc = './api/downloadFile?DocId=null';
              this.onEditDocument.emit(result);
            },
            error: (error) => {
              console.log("Error", error);
            }, 
            complete: () => { }
          });
      } else {
        console.log("Edit Document cancelled");
      }
    });

  }
  onDelete() {
    this.data = {
      title: 'Delete Document?',
      message: 'Are You Sure, Do you want to Delete this Document?'
    }
    const deleteDialog = this.dialog.open(
      DeleteConfirmDialogComponent, {
      width: "300px",
      disableClose: true,
      data: this.data
    });

    deleteDialog.afterClosed().subscribe(res => {
      if (res) {
        this.mainService.deleteDocument(this.selectedDocument)
          .subscribe({
            next: (resp) => {
              this.snackBar.open("Successfully Deleted", "OK", {
                duration: 2000,
              });
            },
            error: (error) => {
              console.log("Error", error);
            }, 
            complete: () => { }
          });
        this.onDeleteDocument.emit(res);
      } else {
        console.log("Deletion Cancelled");
      }
    });
  }
}

@Component({
  selector: 'edit-application-document',
  templateUrl: 'document-details-edit.dialog.html',
})
export class EditDocumentDialog {

  constructor(
    public editDialog: MatDialogRef<EditDocumentDialog>,
    @Inject(MAT_DIALOG_DATA) public document: any
  ) { }

  onSubmit() {
    this.document.DewDocs = true;
    this.editDialog.close(this.document);
  }

  cancelPopup(): void {
    this.editDialog.close();
  }

}

@Component({
  selector: 'add-application-document',
  templateUrl: 'document-details-add.dialog.html',
})
export class AddDocumentDialog {
  isValid: boolean = false;
  constructor(
    public addDialog: MatDialogRef<AddDocumentDialog>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public document: any
  ) { }

  onSubmit() {
    this.document.DewDocs = true;
    if (this.document.FileName) {
      this.addDialog.close(this.document);
    } else {
      this.snackBar.open("You need to Upload the Document!", "OK", {
        duration: 2000,
      });
    }
  }

  cancelPopup(): void {
    this.addDialog.close();
  }

  isFileUploaded(isValid: boolean) {
    this.isValid = isValid;
  }

}

