import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dew-confirm-dialog',
  templateUrl: './dew-confirm-dialog.component.html',
})
export class DewConfirmDialogComponent implements OnInit {


  constructor(
    public confirmDialog: MatDialogRef<DewConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  cancelPopup(): void {
    this.confirmDialog.close();
  }

  ok() {
    this.confirmDialog.close(!this.data.response);
  }

  ngOnInit() {
  }
}
