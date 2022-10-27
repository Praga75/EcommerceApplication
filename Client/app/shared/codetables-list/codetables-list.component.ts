import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { Operation, CodeTableHeader } from '@interfaces/user';
import { ApiResult } from '@interfaces/api-result';
import { MainService } from '@services/main.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '@shared/delete-confirm-dialog/delete-confirm-dialog.component'

@Component({
  selector: 'app-codetables-list',
  templateUrl: './codetables-list.component.html'
})
export class CodetablesListComponent implements OnInit {

  @Output() onSelectCodeTableHeader = new EventEmitter<CodeTableHeader>();

  CodeTableHeaderList: any;
  CodeTableHeaderListFilters: any = {};
  CodeTableHeaderListTotal: number;
  data: { title: string; message: string; action: boolean };

  constructor(public mainService: MainService,
    public snackBar: MatSnackBar, public dialog: MatDialog) { }

  emitSelectedOperation(codetableheader: CodeTableHeader) {
    this.onSelectCodeTableHeader.emit(codetableheader);
  }

  ngOnInit() {

  }

  getCodeTableHeaders() {
    this.mainService.getCodeTableHeaders(this.CodeTableHeaderListFilters)
      .subscribe({
        next: (data: any) => {
          if (data && data.results && data.results.length > 0) {
            this.CodeTableHeaderList = data.results;
            this.CodeTableHeaderListTotal = data.total;
          } else if (data) {
            this.CodeTableHeaderList = data;
            this.CodeTableHeaderListTotal = data.length;
          }
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      }
        
      );
  }




  addCodeTableHeader() {

    const addCodeHeaderDialog = this.dialog.open(AddCodeTableHeaderDialog, {
      width: "300px",
      disableClose: true,
      data: {}
    });

    addCodeHeaderDialog.afterClosed().subscribe(codeTableHeader => {
      if (codeTableHeader) {
        this.mainService.insertCodeTableHeader(codeTableHeader)
          .subscribe({
            next: (resp: any) => {
              if (resp.msg) {
                this.snackBar.open(resp.msg, "OK", {
                  duration: 2000,
                });
              } else {
                this.snackBar.open("Successfully Added", "OK", {
                  duration: 2000,
                });
              }

              this.getCodeTableHeaders();
            },
            error: (error) => {
              console.log("Error", error);
            }, 
            complete: () => { }
          });
      } else {
        console.log("Add Code table cancelled");
      }
    });
  }

  pageChange() {
    this.getCodeTableHeaders();
  }

  deleteCodeTable(codeTableHeader, event: Event) {
    event.stopPropagation();
    this.data = {
      title: 'Delete codeTable',
      message: 'Are you Sure, Do you want to delete this Codetable?',
      action: false
    }
    const deleteDialog = this.dialog.open(
      DeleteConfirmDialogComponent, {
      width: "300px",
      disableClose: true,
      data: this.data
    });

    deleteDialog.afterClosed().subscribe(res => {
      if (res) {
        if (codeTableHeader) {
          this.mainService.deleteTableHeader(codeTableHeader)
            .subscribe({
              next: (resp: any) => {
                if (resp && resp.msg) {
                  this.snackBar.open("Please Delete all Code Table Values to remove header", "OK", {
                    duration: 2000,
                  });
                }
                else {
                  this.snackBar.open('Successfully Deleted', "OK", {
                    duration: 2000,
                  });
                  this.emitSelectedOperation(null);
                }
                this.getCodeTableHeaders();
              },
              error: (error) => {
                this.snackBar.open(error, "OK", {
                  duration: 2000,
                });
                console.log("Error", error);
                this.getCodeTableHeaders();
              }, 
              complete: () => { }
            });
        }
      } else {
        console.log("Deletion Cancelled");
      }
    });
  }
}


@Component({
  selector: 'add-codetableheader',
  templateUrl: 'codetables-list-add.dialog.html',
})
export class AddCodeTableHeaderDialog {

  constructor(
    public addcodeTableHeaderDialog: MatDialogRef<AddCodeTableHeaderDialog>,
    @Inject(MAT_DIALOG_DATA) public codeTableHeader: any
  ) { }

  onSubmit() {
    this.addcodeTableHeaderDialog.close(this.codeTableHeader);
  }
  cancelPopup(): void {
    this.addcodeTableHeaderDialog.close();
  }

}
