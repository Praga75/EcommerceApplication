import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { DeleteConfirmDialogComponent } from '@shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { DewConfirmDialogComponent } from '@shared/dew-confirm-dialog/dew-confirm-dialog.component';
import { DewAlertDialogComponent } from '@shared/dew-alert-dialog/dew-alert-dialog.component';
import * as moment from 'moment-timezone'; // add this 1 of 4
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class DewService {
  public permissionsChanged: EventEmitter<any>;
  messages: string[] = []

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,

  ) {
    this.permissionsChanged = new EventEmitter();
  }

  addMessage(message: string) {
    this.messages.push(message);
  }

  clearMessage() {
    this.messages = [];
  }

  navigateToPage(stateName, params) {
    this.router.navigate([stateName, params]);
  }

  confirmDelete(width, data, cb) {
    const deleteDialog = this.dialog.open(
      DeleteConfirmDialogComponent, {
      width: width,
      disableClose: true,
      data: data
    });
    deleteDialog.afterClosed().subscribe(res => {
      if (res) {        
        cb(null, res);
      } else {
        cb('cancelled')
      }
    });
  }

  confirmPopup(width, header, message, response, cb) {
    const confirmDialog = this.dialog.open(
      DewConfirmDialogComponent, {
      width: width ? width + 'px' : '300px',
      disableClose: true,
      data: {
        message: message,
        header: header,
        response: response
      }
    });
    confirmDialog.afterClosed().subscribe(res => {
      if (res) {
        cb(null, res);
      } else {
        cb('cancelled')
      }
    });
  }

  alertPopup(width, message, response, cb) {
    const alertDialog = this.dialog.open(
      DewAlertDialogComponent, {
      width: width ? width + 'px' : '300px',
      disableClose: true,
      data: {
        message: message,
        response: response
      }
    });
    alertDialog.afterClosed().subscribe(res => {
      if (res) {
        cb(null, res);
      } else {
        cb('cancelled')
      }
    });
  }

  showSnackBar(message, action: string = 'Ok', duration?: number) {
    this.snackBar.open(message, action, {
      duration: duration || 2000,
    });
  }


  getLocalDate(input) {
    let stillUtc = moment.utc(input).toDate();
    let response = moment.tz(stillUtc, moment.tz.guess()).format('LLLL zz');
    return response;
  }

  relativeTime(input) {
    return moment(input).fromNow();
  }

  isCurrentDateTimeGreaterThanThis(dateTime) {
    var now = moment();
    var readableDate = moment(dateTime).format("LLLL");
    return [now.isAfter(dateTime), readableDate];
  }

  formatDate(input) {
    let stillUtc = moment.utc(input).toDate();
    let local = moment(stillUtc).local().format('LL');
    return local;
  }

  getDayDifference(dayOne, dayTwo) {
    var dayOne = dayOne;
    var daytwo = dayTwo;
    var day1 = moment(dayOne.getFullYear() + "-" + dayOne.getMonth() + "-" + dayOne.getDay(), "YYYY-MM-DD");
    var day2 = moment(daytwo.getFullYear() + "-" + daytwo.getMonth() + "-" + daytwo.getDay(), "YYYY-MM-DD");
    return moment.duration(day1.diff(day2)).asDays();
  }

  getTimeDifferenceFromCurrentDate({ time }) {
    let t1 = moment(time);
    let t2 = moment(new Date());
    let diff = t1.diff(t2);

    var diffInfo = {
      difference: diff,
      time: moment.utc(diff).format("HH:mm:ss")
    }
    return diffInfo;
  }

  addMinutesToDatime({ dateTime, minutesToAdd }) {
    var dateTimeVal = moment(dateTime)
      .add(minutesToAdd, 'minutes').toDate();
    dateTimeVal.setSeconds(0);
    dateTimeVal.setMilliseconds(0);
    return moment(dateTimeVal).format();
  }

  setSecondsToZero({ dateTime }) {
    var dateTimeVal = moment(dateTime).toDate();
    dateTimeVal.setSeconds(0);
    dateTimeVal.setMilliseconds(0);
    return moment(dateTimeVal).format();
  }

  extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
    }
    else {
      hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
  }

  extractRootDomain(url) {
    var domain = this.extractHostname(url),
      splitArr = domain.split('.'),
      arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain 
    if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
      if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
        //this is using a ccTLD
        domain = splitArr[arrLen - 3] + '.' + domain;
      }
    }
    return domain;
  }

}
