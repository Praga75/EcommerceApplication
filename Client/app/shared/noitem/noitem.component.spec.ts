import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoitemComponent } from './noitem.component';

describe('NoitemComponent', () => {
  let component: NoitemComponent;
  let fixture: ComponentFixture<NoitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
