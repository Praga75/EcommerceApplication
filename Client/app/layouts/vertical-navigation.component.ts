import { Component, Output, EventEmitter } from '@angular/core';
import { DewAuthService } from '../authentication/auth.service';
import { Config } from '../config';

@Component({
  selector: 'vertical-navigation',
  templateUrl: './vertical-navigation.component.html'
})
export class VerticalNavigationComponent {

  @Output() closeSideNavigation = new EventEmitter<any>();

  closeSideNav(event) {
    this.closeSideNavigation.emit(event);
  }


  isLoggedIn;
  project = { name: Config.projectName, logo: Config.projectLogoUrl };
  constructor(private authService: DewAuthService) { }
}
