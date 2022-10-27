import { Component, OnInit, Input, Inject, EventEmitter, Output, SimpleChanges, SimpleChange } from '@angular/core';
import { MainService } from '@services/main.services';
import { Role } from '@interfaces/user';
import { ApiResult } from '@interfaces/api-result';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '@shared/delete-confirm-dialog/delete-confirm-dialog.component'
@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
})
export class RoleDetailsComponent implements OnInit {
  @Input() selectedRole: any;
  @Input() roleList;
  @Output() onEditRole = new EventEmitter<any>();
  @Output() onEditEntity = new EventEmitter<any>();
  @Output() onDeleteRole = new EventEmitter<any>();
  @Output() deleteRoleEntityOperation = new EventEmitter<any>();

  public roleEntityOperations;
  public roleEntityOperationsTotal;
  public roleEntityOperationFilter = {};

  public getSecurityEntitiesResponseList;
  public getOperationsResponseList;

  displayedColumns: string[] = ['EntityName', 'OperationName', 'Delete'];
  data: { title: string; message: string; action: boolean };

  constructor(
    public mainService: MainService, public snackBar: MatSnackBar, public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getRoleEntities();
  }

  ngOnChanges(changes: SimpleChanges) {
    const selectedRole: SimpleChange = changes.selectedRole;
    // console.log('prev value: ', selectedRole.previousValue);
    // console.log('got name: ', selectedRole.currentValue);
    this.selectedRole = selectedRole.currentValue ? selectedRole.currentValue : null;
    this.getRoleEntities();
  }
  getRoleEntities() {
    this.mainService.getRoleDetails(this.selectedRole)
      .subscribe({
        next: (resp: any) => {
          _.each(this.roleList, function (r) {
            var foundRole = _.find(resp.RoleParents, function (r2) {
              return r.RoleName == r2;
            });
            r.isChecked = foundRole != null;
          });
          this.roleEntityOperations = resp.Permissions;
          this.roleEntityOperationsTotal = resp.Permissions.length;
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });

    this.mainService.getSecurityEntities({})
      .subscribe({
        next: (data: any) => {
          if (data && data.results && data.results.length > 0) {
            this.getSecurityEntitiesResponseList = data.results;
          } else if (data) {
            this.getSecurityEntitiesResponseList = data;
          }
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });

    this.mainService.getOperations({})
      .subscribe({
        next: (data: any) => {
          if (data && data.results && data.results.length > 0) {
            this.getOperationsResponseList = data.results;
          } else if (data) {
            this.getOperationsResponseList = data;
          }
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });

  }

  onEdit() {
    const editDialog = this.dialog.open(
      EditApplicationRoleDialog, {
      width: "300px",
      disableClose: true,
      data: {
        role: this.selectedRole,
        roleList: this.roleList,
        roleOrg: Object.assign({}, this.selectedRole),
      }
    });

    editDialog.afterClosed().subscribe(result => {
      if (result) {
        this.onEditRole.emit(result);
      }
    });

  }
  onDelete() {
    this.data = {
      title: 'Delete Role?',
      message: 'Are You Sure, Do you want to Delete this Role?',
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
        this.onDeleteRole.emit(this.selectedRole);
      } else {
        console.log("Deletion Cancelled");
      }
    });
  }

  delete(data) {
    this.data = {
      title: 'Delete Role?',
      message: 'Are You Sure, Do you want to Delete this Role?',
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
        this.deleteRoleEntityOperation.emit(data);
      } else {
        console.log("Deletion Cancelled");
      }
    });
  }

  addEntity() {
    const addEntityDialog = this.dialog.open(
      RoleAddEntityOperationDialog, {
      width: "300px",
      disableClose: true,
      data: {
        securityEntities: this.getSecurityEntitiesResponseList,
        operations: this.getOperationsResponseList,
        roleOperation: {
          RoleName: this.selectedRole.RoleName,
          EntityName: '',
          OperationName: ''
        }
      }
    });

    addEntityDialog.afterClosed().subscribe(result => {
      if (result) {
        this.onEditEntity.emit(result);
      }
    });
  }
}

@Component({
  selector: 'edit-application-role',
  templateUrl: 'role-details-edit.dialog.html',
})
export class EditApplicationRoleDialog {

  constructor(
    public editDialog: MatDialogRef<EditApplicationRoleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  onSubmit() {
    this.editDialog.close(this.data);
  }

  cancelEdit(): void {
    this.editDialog.close();
  }

}

@Component({
  selector: 'add-application-role',
  templateUrl: 'role-details-add.dialog.html',
})
export class AddApplicationRoleDialog {

  constructor(
    public addDialog: MatDialogRef<AddApplicationRoleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onSubmit() {
    this.addDialog.close(this.data)
  }

  cancelAdd(): void {
    this.addDialog.close();
  }

}

@Component({
  selector: 'role-add-entity-operation',
  templateUrl: 'role-add-entity-operation.dialog.html',
})
export class RoleAddEntityOperationDialog {

  constructor(
    public addDialog: MatDialogRef<RoleAddEntityOperationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


  onSubmit() {
    this.addDialog.close(this.data)
  }

  cancelEdit(): void {
    this.addDialog.close();
  }

}
