import { Component, OnInit, Inject } from "@angular/core";

import { ApiService } from '@services/api.services';
import { DewAuthService } from '@core/auth.service';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
    selector: "app-tac-editor",
    templateUrl: "./tacEditor.component.html"
})
export class tacEditorComponent implements OnInit {

    termsAndCondtions: any = {};
    orgId: any;
    currentUser: any;
    data: any = {};

    default: any = {

    };




    tempTermaAndCondtions: any;

    constructor(
        private authService: DewAuthService,
        private api: ApiService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.currentUser = this.authService.currentUser;
        this.orgId = this.currentUser.orgIds;

        this.default.editorValue = '<p><strong> Audio:</strong><br/>By enabling <strong> audio service </strong> you will be able to communicate with the representative.</p>' +
            '<p><strong> Camera: </strong><br/>By enabling <strong> video service </strong> you will be able to communicate with the representative and display documents during the verification process.</p>' +
            '<p><strong> Location: </strong><br/>By enabling <strong> geo location service </strong>we can legalise location for the verification process.</p>' +
            '<p>** On Clicking <strong> Ok </strong> you will be accepting terms and conditions to allow access by our representative for the verification process to go seamlessly.</p>';

        this.termsAndCondtions = this.default;
        this.getTermsAndConditions();
    }

    getTermsAndConditions() {
        
    }

    updateTermsAndConditions() {
        this.tempTermaAndCondtions = Object.assign({}, this.termsAndCondtions)
        const modal = this.dialog.open(tacEditorDialog, {
            width: "80%",
            disableClose: true,
            data: this.tempTermaAndCondtions
        });

        modal.afterClosed().subscribe((res) => {
            if (res) {
                this.getTermsAndConditions();
            } else {

            }
        });
    }
}


@Component({
    templateUrl: 'tacEditor.dialog.component.html',
})
export class tacEditorDialog {
    termsAndCondtions: any = {};
    constructor(
        private api: ApiService,
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<tacEditorDialog>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.termsAndCondtions = data;
    }
    ok(res) {
        this.dialogRef.close(res);
    }
    cancel() {
        this.dialogRef.close(null);
    }


    saveTermAndConditions() {
        this.termsAndCondtions.id ? this.updateTermsAndConditions() : this.createTermsAndConditions();
    }

    createTermsAndConditions() {
       
    }

    updateTermsAndConditions() {
        
    }
}

