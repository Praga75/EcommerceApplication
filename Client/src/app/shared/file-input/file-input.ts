import { Component, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MainService } from '@services/main.services';
import * as $ from 'jquery';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';


@Component({
    selector: 'file-input',
    template: `
    <input #fileinput  id="fileUpload" name="fileUpload" type="file" placeholder="upload here" style="display:none;">
    <button mat-button mat-raised-button color="primary" type="button" (click)="uploadFile()"><mat-icon>add</mat-icon> {{label}}</button>
    <ul style="margin-top: 10px">
      <li *ngFor="let file of files" [@fadeInOut]="file.state">
            <span id="file-label">
            {{file.data.name}} 
            <br />
            <a title="Upload" (click)="insertUpload(file)"><mat-icon>file_upload</mat-icon></a>
            <a title="Cancel" (click)="cancelFile(file)" *ngIf="file.canCancel">
            <mat-icon>cancel</mat-icon></a>
            </span>
            <hr style="border: 0; outline:0; margin: 5px 0; border-bottom: 1px solid #EEE" />
      </li>
    </ul>
    <span #remoteFileName [ngClass]="{'error-msg': msgtype =='error', 'success-msg':msgtype=='success' }"></span>`,
    styles: [`
        ul,
        li {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        #file-label {
            display: block;
            vertical-align: middle;
            font-size: 12px;
            line-height: 18px;
            width:200px;
            word-wrap:break-word;
        }

        #file-label mat-icon {
            font-size: 18px;
            text-align: center;
        }

        #file-label a {
            cursor: pointer;
        }`],
    animations: [
        trigger('fadeInOut', [
            state('in', style({ opacity: 100 })),
            transition('* => void', [
                animate(300, style({ opacity: 0 }))
            ])
        ])
    ]
})
export class FileInput {

    @Input() document: any;
    @Input() FileNameField: any;
    @Input() OriginalFileNameField: any;
    @Input() MimeTypeField: any;
    @Input() fileType: any;
    @Input() isDewDoc: any;
    @Input() DocId: any;
    @Input() label = 'Choose File';
    @Output() fileUploaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('fileinput', { static: false }) fileInput: ElementRef;
    @ViewChild('remoteFileName', { static: false }) remoteFileName: ElementRef;
    onChange: any = () => { };
    onTouched: any = () => { };
    msgtype: string;

    @Input('value') _value = false;
    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.onChange(val);
        this.onTouched();
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    writeValue(value) {
        if (value) {
            this.value = value;
        }
    }
    public files: Array<FileUploadModel> = [];

    constructor(private mainApi: MainService) { }

    uploadFile() {
        var remoteFNSpan = this.remoteFileName.nativeElement;
        $(remoteFNSpan).html("");

        const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
        fileUpload.onchange = () => {
            this.files = [];
            for (let index = 0; index < fileUpload.files.length; index++) {
                const file = fileUpload.files[index];
                this.files.push({
                    data: file, state: 'in',
                    inProgress: false, progress: 0, canRetry: false, canCancel: true
                });
            }

        };
        fileUpload.click();
    };

    cancelFile(file: FileUploadModel) {
        this.removeFileFromArray(file);
    }

    private removeFileFromArray(file: FileUploadModel) {
        const index = this.files.indexOf(file);
        if (index > -1) {
            this.files.splice(index, 1);
        }
    }

    retryFile(file: FileUploadModel) {
        this.insertUpload();
        file.canRetry = false;
    }

    insertUpload() {
        var inputElement = this.fileInput.nativeElement;
        var remoteFNSpan = this.remoteFileName.nativeElement;
        var file = inputElement.files[0];
        if (inputElement.files.length > 0) {

            if (this.fileType == 'image') {
                var fileFormatAllowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/tiff', 'image/bmp']

                if (fileFormatAllowed.indexOf(file.type) >= 0) {
                    var isValidSize = file.size < 5266500 ? true : false;

                    if (isValidSize) {
                        var isValidFileFormat = true;
                    }

                    else {
                        var errorMsg = "Image size is not more than 5 MB";
                        this.msgtype = "error";
                        var isValidFileFormat = false;
                    }
                }

                else {
                    var errorMsg = "Invaild file format.Please upload png or jpg or jpeg";
                    this.msgtype = "error";
                    var isValidFileFormat = false;
                }
                // var isValidFileFormat = fileFormatAllowed.indexOf(file.type) >= 0 ? true : false;
            }

            else if (this.fileType == 'document') {
                var fileFormatAllowed = ['text/html', 'image/css', 'image/gif', 'image/jpg', 'image/jpeg', 'image/png', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'video/mp4', 'video/avi', 'audio/mp3', 'image/bmp', 'application/x-bzip', 'application/x-bzip2',
                    'text/csv', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/gzip', 'image/vnd.microsoft.icon',
                    'application/java-archive', 'text/javascript', 'application/json', 'audio/mpeg', 'video/mpeg', 'application/vnd.apple.installer+xml', 'application/vnd.oasis.opendocument.presentation',
                    'application/vnd.oasis.opendocument.spreadsheet',
                    'application/vnd.oasis.opendocument.text',
                    'audio/ogg',
                    'video/ogg',
                    'application/ogg',
                    'font/otf',
                    'application/php',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'application/x-rar-compressed',
                    'application/rtf',
                    'application/x-sh',
                    'application/x-tar',
                    'image/tiff',
                    'video/mp2t',
                    'font/ttf',
                    'text/plain',
                    'application/vnd.visio',
                    'audio/wav',
                    'audio/webm',
                    'video/webm',
                    'image/webp',
                    'font/woff',
                    'font/woff2',
                    'application/xhtml+xml',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/zip',
                    'video/3gpp',
                    'application/x-7z-compressed']
                var errorMsg = "Invaild file format";
                this.msgtype = "error";
                var isValidFileFormat = fileFormatAllowed.indexOf(file.type) >= 0 ? true : false;
            }

            else {
                var isValidFileFormat = true;
            }
        }
        if (inputElement.files.length > 0) {
            if (isValidFileFormat) {
                this.isDewDoc = this.isDewDoc ? this.isDewDoc : false;
                this.mainApi.uploadFile(inputElement.files[0], this.isDewDoc).subscribe({
                    next: (res: any) => {
                        if (this.document) {
                            this.files = [];
                            this.msgtype = "success";
                            $(remoteFNSpan).html("<span>Uploaded Successfully</span>");
                            if (this.isDewDoc && this.DocId && this.DocId.length > 0) {
                                this.document[this.DocId] = res.docId;
                            }
                            if (this.FileNameField && this.FileNameField.length > 0) {
                                this.document[this.FileNameField] = res.remoteFileName;
                            }
                            if (this.OriginalFileNameField && this.OriginalFileNameField.length > 0) {
                                this.document[this.OriginalFileNameField] = res.originalFileName;
                            }
                            if (this.MimeTypeField && this.MimeTypeField.length > 0) {
                                this.document[this.MimeTypeField] = res.mimeType;
                            }
                        }
                        this.value = res.remoteFileName;
                        this.fileUploaded.emit(isValidFileFormat);
                    }, 
                    error: err => {
                        alert('Server error. Please try again later.')
                    }, 
                    complete: () => { }
                });
            }
            else {
                $(remoteFNSpan).html(errorMsg);
                this.fileUploaded.emit(isValidFileFormat);
            }
        }
        else { alert('Please select a file to upload.'); }
    }
}


export class FileUploadModel {
    data: File;
    state: string;
    inProgress: boolean;
    progress: number;
    canRetry: boolean;
    canCancel: boolean;
    sub?: Subscription;
}
