import { DewService } from '@services/dew.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Config } from '../../config';
import { MainService } from '@services/main.services';


@Component({
  selector: 'app-waitForMeeting',
  templateUrl: './waitForMeeting.component.html',
})
export class waitForMeetingComponent implements OnInit {

  data: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.data = params
    });
  }
}
