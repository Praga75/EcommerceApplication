import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-confirm',
  templateUrl: './logout-confirm.component.html',
})
export class LogoutConfirmComponent implements OnInit {

  constructor( public logoutDialog: MatDialogRef<LogoutConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public userResponse: any
  ) { }

  cancelPopup(): void {
    this.logoutDialog.close();
  }

  ok() {
    this.logoutDialog.close(!this.userResponse);
  }
  ngOnInit(): void {
  }

}
