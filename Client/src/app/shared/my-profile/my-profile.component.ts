import { Component, OnInit, Input, Inject, EventEmitter, Output, SimpleChanges, SimpleChange } from '@angular/core';
import { MainService } from '@services/main.services';
import { User } from '@interfaces/user';
import { ApiResult } from '@interfaces/api-result';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from '@shared/delete-confirm-dialog/delete-confirm-dialog.component'
import { BehaviorSubject, from } from 'rxjs';
import { EditApplicationUserDialog } from '../user-details/user-details.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { CustomValidators } from 'ng2-validation';
import { Title } from "@angular/platform-browser";
import { DewAuthService } from '@app/authentication/auth.service';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']

})
export class MyProfileComponent implements OnInit {
  profileView: any = true;
  currentUser: any = {};
  userRolesList: any = [];
  userDetails: any = {};
  tempDetails: any = {};
  userImage: string = '';

  constructor(
    public dialog: MatDialog,
    public mainService: MainService,
    private authService: DewAuthService,
    public snackBar: MatSnackBar,
    private titleService: Title
  ) {
    this.titleService.setTitle("Profile");

  }

  ngOnInit() {
    this.currentUser = this.userDetails = this.authService.currentUser;
    if (this.currentUser && this.currentUser.userId) {
      this.getUserRoles(this.currentUser.userName);
      this.getAnUser();

    }
  }

  getAnUser() {
    this.mainService.getUser(this.currentUser)
      .subscribe({
        next: (data: ApiResult) => {
          if (data && data.results) {
            this.userDetails = data.results;
          } else if (data) {
            this.userDetails = data;
          }
          this.getUserImage();
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
          if (data && data.results && data.results.length > 0) {
            this.userRolesList = data.results;
          } else if (data) {
            this.userRolesList = data;
          }
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  getUserImage() {
    if (this.userDetails.DocId) {
      this.userImage = './api/downloadProfilePic?DocId=' + this.userDetails.DocId;
    }
  }


  onEdit() {
    this.userDetails.createdBy = this.currentUser.userId;
    this.tempDetails = Object.assign({}, this.userDetails);
    this.tempDetails.isprofile = true;
    const editDialog = this.dialog.open(EditApplicationUserDialog, {
      width: "300px",
      disableClose: true,
      data: this.tempDetails
    });

    editDialog.afterClosed().subscribe(user => {
      if (user) {
        this.mainService.updateUser(user)
          .subscribe({
            next: (resp) => {
              this.snackBar.open("Successfully Updated", "OK", {
                duration: 2000,
              });
              this.getAnUser();
              this.getUserImage();
            },
            error: (error) => {
              console.log("Error", error);
            }, 
            complete: () => { }
          });
      }
    });

  }

  onPasswordReset() {

    const changePassDialog = this.dialog.open(ChangePasswordDialog, {
      width: "300px",
      disableClose: true,
      data: this.userDetails
    });

    changePassDialog.afterClosed().subscribe(user => {
      if (user) {
        user.createdBy = this.currentUser.userId;
        this.mainService.changePassword(user)
          .subscribe({
            next: (resp) => {
              this.snackBar.open("Successfully changed", "OK", {
                duration: 2000,
              });
              this.authService.logout('');
              // this.getAnUser();
            },
            error: (error) => {
              this.snackBar.open("Password change failed due to mismatch", "OK", {
                duration: 2000,
              });
              console.log("Error", error);
            }, 
            complete: () => { }
          });
      } else {
        console.log("Change password cancelled");
      }
    });
  }

}


@Component({
  selector: 'change-appuser-password',
  templateUrl: 'change-password.dialog.html',
})
export class ChangePasswordDialog {
  changePasswordForm: FormGroup;
  private submitted: boolean = false;

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldpassword: new FormControl('', Validators.required),
      newpassword: password,
      confirmpassword: confirmPassword
    });
    this.changePasswordForm.reset();
  }

  isFieldInvalid(field: string) {
    return (
      (!this.changePasswordForm.get(field).valid && this.changePasswordForm.get(field).touched) ||
      (this.changePasswordForm.get(field).untouched && this.submitted)
    );
  }


  constructor(
    public changeDialog: MatDialogRef<ChangePasswordDialog>,
    private formBuilder: FormBuilder,

    @Inject(MAT_DIALOG_DATA) public user: any
  ) { }

  ok() {
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.user.newpassword = this.changePasswordForm.value.newpassword;
    this.user.confirmpassword = this.changePasswordForm.value.confirmpassword;
    this.user.oldpassword = this.changePasswordForm.value.oldpassword;
    this.changeDialog.close(this.user);
  }

  cancelPopup(): void {
    this.changeDialog.close();
  }

}
