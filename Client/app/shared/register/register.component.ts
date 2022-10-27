import { DewService } from '@services/dew.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Config } from '../../config';
import { MainService } from '@services/main.services';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  private submitted: boolean = false;
  returnUrl: string;
  error = '';
  projectLogo: any = '';
  projectName: any = '';
  user: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private mainApi: MainService,
    public dewServices: DewService,
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.projectName = Config.projectName;
    this.projectLogo = Config.projectLogoUrl;

    this.user = {
      userName: 'qqqqq',
      firstName: 'qqqqq',
      lastName: 'qqqqq',
      displayName: 'qqqqq',
      email: 'qqqqqq@gmail.com',
      password: '123456',
      confirmPassword: '123456',
      addressline1: 'edsfde',
      addressline2: 'fdffsdfe',
      country: 'fdsdfs',
      state: 'asffsa',
      city: 'safasf',
      pincode: '123456',
    }
  }



  backToLogin() {
    this.router.navigate(["/login"]);
  }

  isFieldInvalid(field: string) {
    return (
      (!this.registerForm.get(field).valid && this.registerForm.get(field).touched) ||
      (this.registerForm.get(field).untouched && this.submitted)
    );
  }



  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSubmit() {

    this.mainApi.registerUser(this.user)
      .subscribe({
        next: (resp) => {
          this.snackbar.open("Successfully registered", "OK", {
            duration: 2000,
          });

        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });

  }

}



