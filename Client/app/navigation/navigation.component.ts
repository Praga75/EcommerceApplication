import { Component, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { DewAuthService } from '../authentication/auth.service';
import { Config } from '../config';
import { MediaMatcher } from '@angular/cdk/layout';
import { LogoutConfirmComponent } from '@app/shared/logout-confirm/logout-confirm.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {

  @Output() closeSideNav = new EventEmitter<any>();

  sideNavTrigger(event) {
    this.closeSideNav.emit(event);
  }

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void

  constructor(
    public authService: DewAuthService,
    public dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
  }

  project = { name: Config.projectName, logo: Config.projectLogoUrl, navigationType: Config.navigationType };
  ngOnInit() {
  }
  onLogout() {
    const logoutDialog = this.dialog.open(
      LogoutConfirmComponent, {
      width: "300px",
      disableClose: true,
      data: false
    });

    logoutDialog.afterClosed().subscribe(res => {
      if (res) {
        this.authService.logout('');
      } else {
        console.log("Logout Cancelled");
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
