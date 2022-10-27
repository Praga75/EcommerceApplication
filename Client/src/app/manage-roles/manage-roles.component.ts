import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MainService } from '@services/main.services';
import { Role } from '@interfaces/user'
import { ApiResult } from '@interfaces/api-result';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'
import { AddApplicationRoleDialog, RoleDetailsComponent } from '@shared/role-details/role-details.component'
import * as _ from 'lodash';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.component.html',
  providers: [MainService]

})
export class ManageRolesComponent implements OnInit {
  public roles: Role = [];
  getRolesList: ApiResult;
  selectedRole: Role;
  rolesFilter = {};
  noItem: string;
  detailedView: boolean = false;
  listView: boolean = true;
  mobileQuery: MediaQueryList;
  selectedUser: any;
  _mobileQueryListener: () => void;



  @ViewChild(RoleDetailsComponent, { static: false }) roleDetail: RoleDetailsComponent;


  constructor(public mainService: MainService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private titleService: Title,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.titleService.setTitle("Manage Roles");
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit() {
    this.getRoles();
    this.noItem = "Roles";
  }
  async getRoles() {
    this.mainService.getRoles(this.rolesFilter)
      .subscribe({
        next: (data: ApiResult) => {
          this.getRolesList = data;
          if (data && data.results && data.results.length > 0) {
            this.roles = data.results;
          } else if (data) {
            this.roles = data;
          }
          // _.each(this.roles, function (r: any) {
          //   r.isChecked = false;
          // });
        },
        error: (error) => {
          console.log("Error", error);
        },
        complete: () => { }
      });
  }

  onSelect(role: Role): void {
    this.selectedRole = role;
    this.showDetailedView();
  }

  showDetailedView() {
    this.detailedView = true;
  }

  backToListView() {
    this.detailedView = false;
  }

  onEdit(data: any): void {
    var EditedRole: any = {};
    EditedRole.RoleParents = [];
    EditedRole.RoleName = data.role.RoleName;
    EditedRole.OldRoleName = data.roleOrg.RoleName;
    _.each(data.roleList, function (r) {
      if (r.isChecked && r.RoleName != data.role.RoleName) {
        EditedRole.RoleParents.push(r.RoleName);
      }
    });
    this.mainService.updateRoles(EditedRole)
      .subscribe({
        next: (resp) => {
          this.snackBar.open("Successfully Updated", "OK", {
            duration: 2000,
          });
          this.getRoles();
        },
        error: (error) => {
          console.log("Error", error);
        },
        complete: () => { }
      });
  }

  onEntityEdit(data: any): void {
    var insertRoleOperation = data && data.roleOperation ? data.roleOperation : {};
    if (insertRoleOperation) {
      this.mainService.insertRoleEntityOperation(insertRoleOperation)
        .subscribe({
          next: (resp) => {
            this.snackBar.open("Successfully Updated", "OK", {
              duration: 2000,
            });
            this.getRoles();
            this.roleDetail.getRoleEntities();
          },
          error: (error) => {
            console.log("Error", error);
          },
          complete: () => { }
        });
    }
  }

  onDelete(role: Role) {
    this.mainService.deleteRole(role)
      .subscribe({
        next: (resp) => {
          this.snackBar.open("Successfully Deleted", "OK", {
            duration: 2000,
          });
          this.getRoles();
          this.selectedRole = null
          // this.roleDetail.getRoleEntities();
        },
        error: (error) => {
          console.log("Error", error);
        },
        complete: () => { }
      });
  }

  deleteRoleEntityOperation(role: Role) {
    this.mainService.deleteRoleEntityOperation(role)
      .subscribe({
        next: (resp) => {
          this.snackBar.open("Successfully Deleted", "OK", {
            duration: 2000,
          });
          this.roleDetail.getRoleEntities();
        },
        error: (error) => {
          console.log("Error", error);
        },
        complete: () => { }
      });
  }



  addRoles() {
    this.mainService.getRoles(this.rolesFilter).subscribe(
      (response: ApiResult) => {
        const addDialog = this.dialog.open(AddApplicationRoleDialog, {
          width: "300px",
          disableClose: true,
          data: {
            role: {},
            roleList: response
          }
        });

        addDialog.afterClosed().subscribe(data => {
          if (data) {
            var AddRole: any = {};
            AddRole.RoleParents = [];
            AddRole.RoleName = data.role.RoleName;
            _.each(data.roleList, function (r) {
              if (r.isChecked && r.RoleName != data.role.RoleName) {
                AddRole.RoleParents.push(r.RoleName);
              }
            });
            this.mainService.insertRoles(AddRole)
              .subscribe({
                next: async (resp) => {
                  this.snackBar.open("Successfully Added", "OK", {
                    duration: 2000,
                  });
                  await this.getRoles();
                  this.roleDetail.getRoleEntities();
                },
                error: (error) => {
                  console.log("Error", error);
                },
                complete: () => { }
              });
          }
        });
      });
  }


}
