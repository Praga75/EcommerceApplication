import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from '@interfaces/user';
import { ApiResult } from '@interfaces/api-result';
import { MainService } from '@services/main.services';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {

  @Output() onSelectUser = new EventEmitter<User>();
  userList: any;
  userListFilters: any = {};
  userListTotal: number;


  constructor(public mainService: MainService) { }

  emitSelectedUser(user: User) {
    this.onSelectUser.emit(user);
  }

  ngOnInit() {
  }

  getUsers() {
    this.mainService.getUsers(this.userListFilters)
      .subscribe({
        next: (data: any) => {
          if (data && data.results && data.results.length > 0) {
            this.userList = data.results;
            this.userListTotal = data.total;
          } else {
            this.userList = data;
            this.userListTotal = data.length;
          }
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  pageChange() {
    this.getUsers();
  }
}
