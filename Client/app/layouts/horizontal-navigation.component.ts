import { Component } from '@angular/core';
import { DewAuthService } from '../authentication/auth.service';
import { Config } from '../config';

@Component({
  selector: 'horizontal-navigation',
  templateUrl: './horizontal-navigation.component.html'
})
export class HorizontalNavigationComponent {
  project = { name: Config.projectName, logo: Config.projectLogoUrl };
  isAuthenticated;
  constructor(public authService: DewAuthService) { }
  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated.value;
  }  
}
