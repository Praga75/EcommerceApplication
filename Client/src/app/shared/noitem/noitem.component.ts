import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-noitem',
  templateUrl: './noitem.component.html',
})

export class NoitemComponent implements OnInit {
  @Input() noItem: any;
  constructor() { }

  ngOnInit() {
  }

}
