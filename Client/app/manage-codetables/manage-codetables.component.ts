import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MainService } from '@services/main.services';
import { Operation } from '../interfaces/user'
import { ApiResult } from '../interfaces/api-result';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'
import { CodetablesListComponent } from '@shared/codetables-list/codetables-list.component';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-manage-codetables',
  templateUrl: './manage-codetables.component.html',
  providers: [MainService]

})
export class ManageCodetablesComponent implements OnInit {
  public codeTableHeaders: Operation = [];
  getCodeTableHeaderList: ApiResult;
  selectedCodeTableHeader: Operation;
  detailedView: boolean = false;
  listView: boolean = true;
  noItem: String;
  mobileQuery: MediaQueryList;
  selectedUser: any;
  _mobileQueryListener: () => void;

  @ViewChild(CodetablesListComponent, { static: false }) private codeTableHeaderList: CodetablesListComponent;


  constructor(public mainService: MainService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private titleService: Title,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.titleService.setTitle("Manage Codetables");
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit() {
    this.noItem = "CodeTables";
  }



  onSelect(codeTableHeader: Operation): void {
    this.selectedCodeTableHeader = codeTableHeader;
    this.showDetailedView();
  }

  showDetailedView() {
    this.detailedView = true;
  }

  backToListView() {
    this.detailedView = false;
  }

  onEdit(codeTableHeader: Operation): void {
    this.mainService.updateOperations(codeTableHeader)
      .subscribe({
        next: (resp) => {
          this.snackBar.open("Code Table Successfully Updated", "OK", {
            duration: 2000,
          });
          this.codeTableHeaderList.getCodeTableHeaders();
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  onDelete(codeTableHeader: Operation): void {
    this.mainService.deleteRoleEntityOperation(codeTableHeader)
      .subscribe({
        next: (resp) => {
          this.snackBar.open("Code table Successfully Deleted", "OK", {
            duration: 2000,
          });
          this.codeTableHeaderList.getCodeTableHeaders();
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }



}
