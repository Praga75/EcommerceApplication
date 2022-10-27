import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DewAuthService } from './auth.service';
import { Config } from '../config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  projectName = '';
  footerText = '';
  projectLogo = '';
  loggedInUser = '';
  private submitted: boolean = false;
  returnUrl: string;
  error = '';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: DewAuthService,
    public snackBar: MatSnackBar,
    private titleService: Title

  ) {


   }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.loggedInUser = params.loggedInUser
      });

    this.projectName = Config.projectName;
    this.projectLogo = Config.projectLogoUrl;
    this.footerText = Config.footerText;
    this.titleService.setTitle(this.projectName);
    this.loginForm = this.formBuilder.group({
      userName: [this.loggedInUser, Validators.required],
      password: ['', Validators.required],
      stayLoggedIn: [false]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // reset login status
    this.authenticationService.logout(this.returnUrl);

  }

  // convenience getter for easy access to form fields

  isFieldInvalid(field: string) {
    return (
      (!this.loginForm.get(field).valid && this.loginForm.get(field).touched) ||
      (this.loginForm.get(field).untouched && this.submitted)
    );
  }


  onSubmit() {
    this.submitted = true;
    this.error = null;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.loginForm.value)
      .pipe(first())
      .subscribe({
        next:  data => {
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          this.error = error;
          this.loading = false;
          this.snackBar.open("Authentication Failed / Invalid Credentials", "", {
            duration: 5000,
            panelClass : 'alert-bg'
          });
        }, 
        complete: () => { }
      });
  }
}


