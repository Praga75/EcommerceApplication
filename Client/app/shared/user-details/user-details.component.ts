import { Component, OnInit, Input, Inject, EventEmitter, Output, SimpleChanges, SimpleChange, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MainService } from '@services/main.services';
import { User } from '@interfaces/user';
import { ApiResult } from '@interfaces/api-result';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '@shared/delete-confirm-dialog/delete-confirm-dialog.component'
import { BehaviorSubject } from 'rxjs';


import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import * as _ from 'lodash';
import { DewAuthService } from '@app/authentication/auth.service';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
})
export class UserDetailsComponent implements OnInit {
  @Input() selectedUser: any;
  @Output() onEditUser = new EventEmitter<any>();
  @Output() onDeleteUser = new EventEmitter<any>();
  currentUser: any = {};
  userRolesList: any = [];
  userRoles: any = [];
  existingRoles: any = [];
  globalRoleList: any = [];
  userImage: any = '';
  tempDetails: any;
  tempRoleDetails: any;
  data: { title: string; message: string; action: boolean };
  constructor(
    public dialog: MatDialog,
    public mainService: MainService,
    private authService: DewAuthService,
    public snackBar: MatSnackBar,
    private userImg: ElementRef,
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.getUserRoles(this.selectedUser.userName);
    this.getAllRoles();
    this.getUserImage(this.selectedUser);

  }

  getUserImage(selectedUser) {
    this.userImage = './api/downloadProfilePic?DocId=' + selectedUser.DocId;
  }

  ngOnChanges(changes: SimpleChanges) {
    const selectedUser: SimpleChange = changes.selectedUser;
    // console.log('prev value: ', selectedUser.previousValue);
    // console.log('got name: ', selectedUser.currentValue);
    this.selectedUser = selectedUser.currentValue;
    this.getUserImage(this.selectedUser);
    this.getUserRoles(this.selectedUser.userName);

  }

  getAllRoles() {
    this.mainService.getRoles({})
      .subscribe({
        next: (data: ApiResult) => {
          if (data && data.results && data.results.length > 0) {
            this.globalRoleList = data.results;
          } else if (data) {
            this.globalRoleList = data;
          }
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  getUserRoles(username) {
    this.mainService.getUserRoles(username)
      .subscribe({
        next: (data: ApiResult) => {

          this.userRoles = [];
          this.existingRoles = [];

          if (data && data.results && data.results.length > 0) {
            this.userRolesList = data.results;
          } else if (data) {
            this.userRolesList = data;
          }
          var self = this;

          _.forEach(this.userRolesList, function (value, key) {
            self.userRoles.push(value.RoleName);
            self.existingRoles.push(value.RoleName);
          });
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  onEdit() {
    this.selectedUser.createdBy = this.currentUser.userId;
    this.tempDetails = Object.assign({}, this.selectedUser);
    const editDialog = this.dialog.open(EditApplicationUserDialog, {
      width: "300px",
      disableClose: true,
      data: this.tempDetails
    });

    editDialog.afterClosed().subscribe(result => {
      if (result) {
        this.onEditUser.emit(result);
      }
    });

  }
  onDelete() {
    this.data = {
      title: 'Delete User?',
      message: 'Are You Sure, Do you want to Delete this User?',
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
        this.onDeleteUser.emit(this.selectedUser);
      } else {
        console.log("Deletion Cancelled");
      }
    });
  }

  addRoles() {
    this.tempRoleDetails = Object.assign([], this.userRoles);
    const addRolesDialog = this.dialog.open(AddApplicationUserRolesDialog, {
      width: "300px",
      disableClose: true,
      data: {
        selectedUser: this.selectedUser,
        selectUserRoles: this.tempRoleDetails,
        globalRoles: this.globalRoleList
      }
    });

    addRolesDialog.afterClosed().subscribe(data => {
      if (data) {
        var user: any = {};
        user.userName = data.selectedUser.userName;
        user.roles = data.selectUserRoles;
        user.existingRoles = this.existingRoles;
        this.mainService.insertUserRole(user)
          .subscribe({
            next: (resp) => {
              this.getUserRoles(this.selectedUser.userName);
              this.snackBar.open("Successfully Added", "OK", {
                duration: 2000,
              });
            },
            error: (error) => {
              console.log("Error", error);
            }, 
            complete: () => { }
          }
            );
      } else {
        console.log("Add User Roles cancelled");
      }
    });
  }

}



@Component({
  selector: 'edit-application-user',
  templateUrl: 'user-details-edit.dialog.html',
})
export class EditApplicationUserDialog {

  constructor(
    public editDialog: MatDialogRef<EditApplicationUserDialog>,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) { }

  cancelEdit(): void {
    this.editDialog.close();
  }

  onSubmit() {
    this.editDialog.close(this.user)
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }



}

@Component({
  selector: 'add-application-user',
  templateUrl: 'user-details-add.dialog.html',
})
export class AddApplicationUserDialog {
  isValid: boolean = false;

  constructor(
    public addDialog: MatDialogRef<AddApplicationUserDialog>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) { }


  cancelEdit(): void {
    this.addDialog.close();
  }

  onSubmit() {
    if (this.user.DocId) {
      this.addDialog.close(this.user);
    } else {
      this.snackBar.open("You need to Upload the Document!", "OK", {
        duration: 2000,
      });
    }
  }

  isFileUploaded(isValid: boolean) {
    this.isValid = isValid;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }



}

@Component({
  selector: 'add-roles-application-user',
  templateUrl: 'user-details-add-roles.dialog.html',
})
export class AddApplicationUserRolesDialog {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  roleCtrl = new FormControl();
  filteredRoles: Observable<string[]>;
  roles: string[] = [];
  allRoles: string[] = [];

  @ViewChild('roleInput', { static: false }) roleInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;


  constructor(
    public addRolesDialog: MatDialogRef<AddApplicationUserRolesDialog>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roles = data.selectUserRoles;
    this.allRoles = data.globalRoles;
    if (this.allRoles && this.allRoles.length > 0) {
      this.filteredRoles = this.roleCtrl.valueChanges.pipe(
        startWith(null),
        map((role: any) => role ? this._filter(role) : this.allRoles.slice()));
    }
  }
  cancelPopup(): void {
    this.addRolesDialog.close();
  }
  onSubmit() {
    this.addRolesDialog.close(this.data)
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.roles.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.roleCtrl.setValue(null);
    }
  }

  remove(role: any): void {
    var removeData = {
      title: 'Delete Role?',
      message: 'Are You Sure, Do you want to Delete this Role?',
      action: false
    }
    const deleteDialog = this.dialog.open(
      DeleteConfirmDialogComponent, {
      width: "300px",
      disableClose: true,
      data: removeData
    });

    deleteDialog.afterClosed().subscribe(res => {
      if (res) {
        _.remove(this.roles, function (e: any) {
          return e == role;
        });
      } else {
        console.log("Deletion Cancelled");
      }
    });
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    this.roles.push(event.option.viewValue);
    this.roleInput.nativeElement.value = '';
    this.roleCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allRoles.filter((role: any) => role.RoleName.toLowerCase().indexOf(filterValue) === 0);
  }
}





