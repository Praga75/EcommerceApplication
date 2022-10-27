import { BrowserModule } from "@angular/platform-browser";
import { Directive, HostListener, HostBinding, EventEmitter, Input, Output } from '@angular/core';
import * as $ from "jquery";
import * as _ from "lodash";


@Directive({
  selector: "[dragdropdiective]"
})
export class dragdropdiective {
  constructor() {
  } 
  
  ngOnInit() {}
  @Input() private allowed_extensions: Array<string> = [];
  @Output() private filesChangeEmiter: EventEmitter<File[]> = new EventEmitter();
  @Output() private filesInvalidEmiter: EventEmitter<File[]> = new EventEmitter();
  @HostBinding('style.background') private background;

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#d6f3f6';
  }

 
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#b9eaf1';
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#b9eaf1';
    const files = evt.dataTransfer.files;
    const valid_files: Array<File> = [];
    const invalid_files: Array<File> = [];
    if (files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const ext = file.name.split('.')[file.name.split('.').length - 1];
        if (this.allowed_extensions.lastIndexOf(ext) !== -1) {
          valid_files.push(file);
        } else {
          invalid_files.push(file);
        }
      });
      this.filesInvalidEmiter.emit(invalid_files);
      if (valid_files.length === 0) {
        return;
      }
      this.filesChangeEmiter.emit(valid_files);
    }
  }
}
