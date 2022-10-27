import { DewService } from '@services/dew.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Config } from '../../config';
import { MainService } from '@services/main.services';


@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
})
export class ForgotComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading = false;
  private submitted: boolean = false;
  returnUrl: string;
  error = '';
  projectLogo: any = '';
  projectName: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private mainApi: MainService,
    public dewServices: DewService) { }

  ngOnInit() {
    this.projectName = Config.projectName;
    this.projectLogo = Config.projectLogoUrl;
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotPasswordForm.controls; }

  backToLogin() {
    this.router.navigate(["/login"]);
  }

  isFieldInvalid(field: string) {
    return (
      (!this.forgotPasswordForm.get(field).valid && this.forgotPasswordForm.get(field).touched) ||
      (this.forgotPasswordForm.get(field).untouched && this.submitted)
    );
  }

  sentResetPasswordLink() {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      this.dewServices.snackBar.open("Please enter a valid email", "OK", {
        duration: 2000,
      });
      return;
    }


    this.loading = true;
    this.mainApi.forgotPassword(this.forgotPasswordForm.value).subscribe({
      next: data => {
        this.dewServices.snackBar.open('Password reset done! New password sent to your mail', "OK", {
          duration: 2000,
        });
        this.loading = false;
      },
      error: error => {
        this.dewServices.snackBar.open('Email does not exist or server error', "OK", {
          duration: 2000,
        });
        this.loading = false;
      }, 
      complete: () => { }
    }
      );

  }
}
