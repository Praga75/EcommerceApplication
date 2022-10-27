import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Entity } from '@interfaces/user';
import { ApiResult } from '@interfaces/api-result';
import { MainService } from '@services/main.services';

@Component({
  selector: 'app-entities-list',
  templateUrl: './entities-list.component.html',
})
export class EntitiesListComponent implements OnInit {

  @Output() onSelectEntity = new EventEmitter<Entity>();

  entityList: any;
  entityListFilters: any = {};
  entityListTotal: number;

  constructor(public mainService: MainService) { }

  emitSelectedEntity(entity: Entity) {
    this.onSelectEntity.emit(entity);
  }


  ngOnInit() {
  }

  getSecurityEntities() {
    this.mainService.getSecurityEntities(this.entityListFilters)
      .subscribe({
        next: (data: any) => {
          if (data && data.results && data.results.length > 0) {
            this.entityList = data.results;
            this.entityListTotal = data.total;
          } else if (data) {
            this.entityList = data;
            this.entityListTotal = data.length;
          }
        },
        error: (error) => {
          console.log("Error", error);
        }, 
        complete: () => { }
      });
  }

  pageChange() {
    this.getSecurityEntities();
  }


}
