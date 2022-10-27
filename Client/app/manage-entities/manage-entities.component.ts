import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MainService } from '@services/main.services';
import { Entity } from '@interfaces/user'
import { ApiResult } from '@interfaces/api-result';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'
import { AddApplicationEntityDialog } from '@shared/entities-details/entities-details.component'
import { EntitiesListComponent } from '@shared/entities-list/entities-list.component'
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-manage-entities',
  templateUrl: './manage-entities.component.html',
  providers: [MainService]

})
export class ManageEntitiesComponent implements OnInit {
  public entities: Entity = [];
  getEntityList: ApiResult;
  selectedEntity: Entity;
  entityFilter = {};
  noItem: String;
  detailedView: boolean = false;
  listView: boolean = true;
  mobileQuery: MediaQueryList;
  selectedUser: any;
  _mobileQueryListener: () => void;
  @ViewChild(EntitiesListComponent, { static: false }) private entityList: EntitiesListComponent;
  constructor(public mainService: MainService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private titleService: Title,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.titleService.setTitle("Manage Entities");
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit() {
    this.noItem = "Entities";
  }


  onSelect(entity: Entity): void {

    this.selectedEntity = entity;
    this.showDetailedView();
  }

  showDetailedView() {
    this.detailedView = true;
  }

  backToListView() {
    this.detailedView = false;
  }

  onEdit(entity: Entity): void {
    this.mainService.updateSecurityEntity(entity)
      .subscribe({
        next: (resp) => {

          this.entityList.getSecurityEntities();
          this.snackBar.open("Entity Successfully Updated", "OK", {
            duration: 2000,
          });
          this.selectedEntity = entity;
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  onDelete(entity: Entity): void {
    this.mainService.deleteSecurityEntity(entity)
      .subscribe({
        next: (resp) => {
          this.selectedEntity = null;
          this.snackBar.open("Entity Successfully Deleted", "OK", {
            duration: 2000,
          });
          this.entityList.getSecurityEntities();
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }


  addEntity() {
    const addDialog = this.dialog.open(AddApplicationEntityDialog, {
      width: "300px",
      disableClose: true,
      data: {}
    });

    addDialog.afterClosed().subscribe(entity => {
      if (entity) {
        this.mainService.insertSecurityEntity(entity)
          .subscribe({
            next: (resp) => {
              this.entityList.getSecurityEntities();
              this.snackBar.open("Successfully Added", "OK", {
                duration: 2000,
              });
              this.entityList.getSecurityEntities();
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
