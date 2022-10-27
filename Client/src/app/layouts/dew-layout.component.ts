import { Component, ViewChild, ChangeDetectorRef, } from '@angular/core';
import { DewAuthService } from '../authentication/auth.service';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective
} from 'ngx-perfect-scrollbar';
import { Config } from '../config';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';


@Component({
  selector: 'dew-layout',
  templateUrl: './dew-layout.component.html'
})
export class DewLayoutComponent {
  @ViewChild(MatSidenav, { static: false }) dewsidenav: MatSidenav

  public matSpinner = MatSpinner;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  public type: string = 'directive';
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;

  closeSideNav() {
    this.dewsidenav.close();
  }

  constructor(
    public authService: DewAuthService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);
  }

 

  project = { name: Config.projectName, logo: Config.projectLogoUrl, navigationType: Config.navigationType };

  ngOnInit() {
  }

  public scrollToTop(): void {
    this.directiveRef.scrollToTop();
  }

  onLogout() {
    this.authService.logout('');
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

