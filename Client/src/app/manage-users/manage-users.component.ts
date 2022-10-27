import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { MainService } from '@services/main.services';
import { User } from '@interfaces/user'
import { ApiResult } from '@interfaces/api-result';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'
import { AddApplicationUserDialog } from '@shared/user-details/user-details.component'
import { UserListComponent } from '@shared/user-list/user-list.component';
import { UserDetailsComponent } from '@shared/user-details/user-details.component';

import { DewAuthService } from '@core/auth.service';
import { Title } from "@angular/platform-browser";
import { NoitemComponent } from '@app/shared/noitem/noitem.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  providers: [MainService]

})
export class ManageUsersComponent implements OnInit {
  public users: any = [];
  user: "User";
  getUserList: ApiResult;
  selectedUser: User;
  currentUser: any = {};
  detailedView: boolean = false;
  listView: boolean = true;
  mobileQuery: MediaQueryList;
  noItem: string;
  _mobileQueryListener: () => void;

  @ViewChild(UserListComponent, { static: false }) private userList: UserListComponent;
  @ViewChild(UserDetailsComponent, { static: false }) private userDetail: UserDetailsComponent;

  constructor(
    public mainService: MainService,
    private authService: DewAuthService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private titleService: Title,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.titleService.setTitle("Manage Users");
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.noItem = "Users";
  }

  onSelect(user: User): void {
    this.mainService.getUser(user)
      .subscribe({
        next: (resp: any) => {
          this.showDetailedView();
          if (resp && resp.results != null) {
            this.selectedUser = resp.results;
          } else {
            this.selectedUser = resp;
          }
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  showDetailedView() {
    this.detailedView = true;
  }

  backToListView() {
    this.detailedView = false;
  }

  onEdit(user: User): void {
    this.mainService.updateUser(user)
      .subscribe({
        next: (resp) => {
          this.snackBar.open("Successfully Updated", "OK", {
            duration: 2000,
          });
          this.userList.getUsers();
          this.onSelect(user);
          this.userDetail.getUserImage(this.selectedUser);
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  onDelete(user: User) {
    // console.log(user);
    this.mainService.deleteUser(user)
      .subscribe({
        next: (resp) => {
          this.snackBar.open("Successfully Deleted", "OK", {
            duration: 2000,
          });
          this.selectedUser = null;
          this.userList.getUsers();
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  onDeleteRole(user: User): void {
    this.mainService.deleteUserRole(user)
      .subscribe({
        next: (resp) => {
          this.snackBar.open("Successfully Deleted", "OK", {
            duration: 2000,
          });
          this.userList.getUsers();

        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }


  addUser() {

    const addDialog = this.dialog.open(AddApplicationUserDialog, {
      width: "300px",
      disableClose: true,
      data: {}
    });

    addDialog.afterClosed().subscribe(user => {
      if (user) {
        user.createdBy = this.currentUser.userId;
        this.mainService.addUser(user)
          .subscribe({
            next: (resp) => {
              this.snackBar.open("Successfully Added", "OK", {
                duration: 2000,
              });
              this.userList.getUsers();
            },
            error: (error) => {
              console.log("Error", error);
            }, 
            complete: () => { }
          });
      } else {
        console.log("Add User cancelled");
      }
    });
  }

}
