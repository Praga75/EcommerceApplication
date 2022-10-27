import { Component, OnInit, Input, Inject, EventEmitter, Output, SimpleChanges, SimpleChange } from '@angular/core';
import { Operation, CodeTable } from '@interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MainService } from '@services/main.services';
import { ApiResult } from '@interfaces/api-result';
import { Event } from '@angular/router';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
@Component({
  selector: 'app-codetables-details',
  templateUrl: './codetables-details.component.html',
})
export class CodetablesDetailsComponent implements OnInit {
  @Input() selectedCodeTableHeader: any;
  roles: [any];
  CodeTableList: any = [];
  CodeTableListFilters: any = {};
  CodeTableListTotal: number;

  displayedColumns: string[] = ['CodeId', 'CodeName', 'CodeDisplayValue', 'CodeValue', 'CodeValueDescription', 'CodeSequence', 'edit', 'delete'];
  tempDetails: any;
  tempCTDetails: any;
  data: { title: string; message: string; action: boolean };

  constructor(
    public mainService: MainService, public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.CodeTableListFilters.pageSize = 10;
    this.CodeTableListFilters.pageNumber = 1;
    this.getCodeTableByName();
  }

  ngOnChanges(changes: SimpleChanges) {
    const selectedCodeTableHeader: SimpleChange = changes.selectedCodeTableHeader;
    this.selectedCodeTableHeader = selectedCodeTableHeader.currentValue;
    this.getCodeTableByName();
  }


  getCodeTableByName() {
    this.mainService.getCodeTables(this.selectedCodeTableHeader.CodeName, this.CodeTableListFilters)
      .subscribe({
        next: (data: any) => {
          if (data && data.results && data.results.length > 0) {
            this.CodeTableList = data.results || [];
            this.CodeTableListTotal = data.total;
          } else if (data) {
            this.CodeTableList = data || [];
            this.CodeTableListTotal = data.length;
          }
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  pageChange() {
    this.getCodeTableByName();
  }


  addCodeTable() {
    this.tempDetails = Object.assign({}, this.selectedCodeTableHeader);
    const addCodeDialog = this.dialog.open(AddCodeTableDialog, {
      width: "300px",
      disableClose: true,
      data: {
        CodeName: this.tempDetails.CodeName
      }
    });

    addCodeDialog.afterClosed().subscribe(codeTable => {
      if (codeTable) {
        this.mainService.insertCodeTable(codeTable)
          .subscribe({
            next: (resp) => {
              this.snackBar.open("Successfully Added", "OK", {
                duration: 2000,
              });
              this.getCodeTableByName();
            },
            error: (error) => {
              console.log("Error", error);
            }, 
            complete: () => { }
          });
      }
    });
  }

  editCodeTable(elem) {
    this.tempCTDetails = Object.assign({}, elem);
    const editCodeDialog = this.dialog.open(EditCodeTableDialog, {
      width: "300px",
      disableClose: true,
      data: this.tempCTDetails
    });

    editCodeDialog.afterClosed().subscribe(codeTable => {
      if (codeTable) {
        this.mainService.updateCodeTable(codeTable)
          .subscribe({
            next: (resp) => {
              this.snackBar.open("Successfully Updated", "OK", {
                duration: 2000,
              });
              this.getCodeTableByName();
            },
            error: (error) => {
              console.log("Error", error);
            }, 
            complete: () => { }
          });
      }
    });
  }


  deleteCodeTable(codeTable, event: Event) {
    if (codeTable) {
      this.data = {
        title: 'Delete Code Table Values',
        message: 'Are you Sure, Do you want to delete this Values?',
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
          this.mainService.deleteCodeTable(codeTable)
            .subscribe({
              next: (resp: any) => {
                if (resp && resp.errno && resp.sqlMessage) {
                  this.snackBar.open("Please Delete all Code Table Values to remove header", "OK", {
                    duration: 2000,
                  });
                }
                else {
                  this.snackBar.open('Successfully Deleted', "OK", {
                    duration: 2000,
                  });
                }
                this.getCodeTableByName();
              },
              error: (error) => {
                console.log("Error", error);
              }, 
              complete: () => { }
            });
        }
      });
    }
  }
}


@Component({
  selector: 'add-codetable',
  templateUrl: 'codetables-details-add.dialog.html',
})
export class AddCodeTableDialog {
  constructor(
    public addDialog: MatDialogRef<AddCodeTableDialog>,
    @Inject(MAT_DIALOG_DATA) public codeTable: any
  ) { }

  onSubmit() {
    this.addDialog.close(this.codeTable)
  }


  cancelPopup(): void {
    this.addDialog.close();
  }
}

@Component({
  selector: 'edit-codetable',
  templateUrl: 'codetables-details-edit.dialog.html',
})
export class EditCodeTableDialog {
  constructor(
    public editDialog: MatDialogRef<EditCodeTableDialog>,
    @Inject(MAT_DIALOG_DATA) public codeTable: any
  ) { }

  onSubmit() {
    this.editDialog.close(this.codeTable)
  }

  cancelPopup(): void {
    this.editDialog.close();
  }
}
