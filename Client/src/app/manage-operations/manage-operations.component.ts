import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MainService } from '@services/main.services';
import { Operation } from '@interfaces/user'
import { ApiResult } from '@interfaces/api-result';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'
import { AddApplicationOperationsDialog } from '@shared/operations-details/operations-details.component'
import { OperationsListComponent } from '@shared/operations-list/operations-list.component'
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-manage-operations',
  templateUrl: './manage-operations.component.html',
  providers: [MainService]

})
export class ManageOperationsComponent implements OnInit {
  public operations: Operation = [];
  getOperationList: ApiResult;
  selectedOperation: Operation;
  detailedView: boolean = false;
  listView: boolean = true;
  noItem: String;
  mobileQuery: MediaQueryList;
  selectedUser: any;
  _mobileQueryListener: () => void;
  @ViewChild(OperationsListComponent, { static: false }) private operationList: OperationsListComponent;

  constructor(public mainService: MainService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private titleService: Title,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher

  ) {
    this.titleService.setTitle("Manage Operations");
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);

  }


  ngOnInit() {
    this.noItem = "Operations";
  }


  onSelect(operation: Operation): void {
    this.selectedOperation = operation;
    this.showDetailedView();
  }

  showDetailedView() {
    this.detailedView = true;
  }

  backToListView() {
    this.detailedView = false;
  }

  onEdit(operation: Operation): void {
    this.mainService.updateOperations(operation)
      .subscribe({
        next: (resp) => {
          this.snackBar.open("Operation Successfully Updated", "OK", {
            duration: 2000,
          });
          this.operationList.getOperations();
          this.selectedOperation = operation;
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  onDelete(operation: Operation): void {
    this.mainService.deleteOperations(operation)
      .subscribe({
        next: (resp) => {
          this.snackBar.open("Operation Successfully Deleted", "OK", {
            duration: 2000,
          });
          this.operationList.getOperations();
          this.selectedOperation = null;
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }


  addOperation() {
    const addDialog = this.dialog.open(AddApplicationOperationsDialog, {
      width: "300px",
      disableClose: true,
      data: {}
    });

    addDialog.afterClosed().subscribe(operation => {
      if (operation) {
        this.mainService.insertOperations(operation)
          .subscribe({
            next: (resp) => {
              this.snackBar.open("Successfully Added", "OK", {
                duration: 2000,
              });
              this.operationList.getOperations();
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
