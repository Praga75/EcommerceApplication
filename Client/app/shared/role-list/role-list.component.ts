import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Role } from '../../interfaces/user';
import { ApiResult } from '../../interfaces/api-result';
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
})
export class RoleListComponent implements OnInit {

  @Output() onSelectRole = new EventEmitter<Role>();
  @Input() roles: Role;
  @Input() roleList: ApiResult  = {} as any;;


  constructor() { }

  emitSelectedRole(role: Role) {
    this.onSelectRole.emit(role);
  }

  ngOnInit() {
    // if (!this.userList) {
    //   this.userList.total = 0;
    // }
  }

}
