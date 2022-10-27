import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import { Entity } from '../../interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component'
@Component({
  selector: 'app-entities-details',
  templateUrl: './entities-details.component.html',
})
export class EntitiesDetailsComponent implements OnInit {
  @Input() selectedEntity: any;
  @Output() onEditEntity = new EventEmitter<Entity>();
  @Output() onDeleteEntity = new EventEmitter<Entity>();
  tempEntity: any;
  data: { title: string; message: string;  action: boolean};

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  onEdit() {

    this.tempEntity = Object.assign({}, this.selectedEntity);
    const editDialog = this.dialog.open(EditApplicationEntityDialog, {
      width: "300px",
      disableClose: true,
      data: this.tempEntity
    });

    editDialog.afterClosed().subscribe(result => {

      if (result) {
        this.onEditEntity.emit(result);
      }
    });

  }
  onDelete() {
    this.data = {
      title:'Delete Entity?',
      message: 'Are You Sure, Do you want to Delete this Entity?',
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
        this.onDeleteEntity.emit(this.selectedEntity);
      } else {
        console.log("Deletion Cancelled");
      }
    });
  }
}

@Component({
  selector: 'edit-application-entities',
  templateUrl: 'entities-details-edit.dialog.html',
})
export class EditApplicationEntityDialog {

  constructor(
    public editDialog: MatDialogRef<EditApplicationEntityDialog>,
    @Inject(MAT_DIALOG_DATA) public entity: any
  ) { }

  onSubmit() {
    this.editDialog.close(this.entity);
  }

  cancelPopup(): void {
    this.editDialog.close();
  }

}

@Component({
  selector: 'add-application-entities',
  templateUrl: 'entities-details-add.dialog.html',
})
export class AddApplicationEntityDialog {

  constructor(
    public addDialog: MatDialogRef<AddApplicationEntityDialog>,
    @Inject(MAT_DIALOG_DATA) public entity: any
  ) { }


  onSubmit() {
    this.addDialog.close(this.entity);
  }

  cancelPopup(): void {
    this.addDialog.close();
  }

}
