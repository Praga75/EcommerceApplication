import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import { Operation } from '../../interfaces/user';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component'
@Component({
  selector: 'app-operations-details',
  templateUrl: './operations-details.component.html',
})
export class OperationsDetailsComponent implements OnInit {
  @Input() selectedOperation: any;
  @Output() onEditOperation = new EventEmitter<Operation>();
  @Output() onDeleteOperation = new EventEmitter<Operation>();
  tempOperation: any;
  data: { title: string; message: string; action: boolean };
  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  onEdit() {
    this.tempOperation = Object.assign({}, this.selectedOperation)
    const editDialog = this.dialog.open(EditApplicationOperationsDialog, {
      width: "300px",
      data: this.tempOperation
    });

    editDialog.afterClosed().subscribe(result => {
      if (result) {
        this.onEditOperation.emit(result);
      }
    });

  }
  onDelete() {
    this.data = {
      title:'Delete Operation?',
      message: 'Are You Sure, Do you want to Delete this Operation?',
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
        this.onDeleteOperation.emit(this.selectedOperation);
      } else {
        console.log("Deletion Cancelled");
      }
    });
  }
}

@Component({
  selector: 'edit-application-operations',
  templateUrl: 'operations-details-edit.dialog.html',
})
export class EditApplicationOperationsDialog {

  constructor(
    public editDialog: MatDialogRef<EditApplicationOperationsDialog>,
    @Inject(MAT_DIALOG_DATA) public operation: any
  ) { }

  onSubmit() {
    this.editDialog.close(this.operation);
  }

  cancelPopup(): void {
    this.editDialog.close();
  }

}

@Component({
  selector: 'add-application-operations',
  templateUrl: 'operations-details-add.dialog.html',
})
export class AddApplicationOperationsDialog {

  constructor(
    public addDialog: MatDialogRef<AddApplicationOperationsDialog>,
    @Inject(MAT_DIALOG_DATA) public operation: any
  ) { }

  onSubmit() {
    this.addDialog.close(this.operation);
  }

  cancelPopup(): void {
    this.addDialog.close();
  }

}
