import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
})
export class DeleteConfirmDialogComponent implements OnInit {
  constructor(
    public deleteDialog: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userResponse: any
  ) { }

  cancelPopup(): void {
    this.deleteDialog.close();
  }

  ok() {
    this.deleteDialog.close(!this.userResponse.action);
  }

  ngOnInit() {
  }
}
