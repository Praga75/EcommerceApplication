import { DewService } from '@services/dew.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Config } from '../../config';
import { MainService } from '@services/main.services';


@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
})
export class ForbiddenComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
