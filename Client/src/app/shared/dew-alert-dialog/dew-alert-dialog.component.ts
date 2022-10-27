import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dew-alert-dialog',
  templateUrl: './dew-alert-dialog.component.html',
})
export class DewAlertDialogComponent implements OnInit {


  constructor(
    public deleteDialog: MatDialogRef<DewAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  cancelPopup(): void {
    this.deleteDialog.close();
  }

  ok() {
    this.deleteDialog.close(!this.data.response);
  }

  ngOnInit() {
  }
}
