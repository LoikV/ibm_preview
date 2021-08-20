import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferedUsersListComponent } from './offered-users-list.component';

describe('OfferedUsersListComponent', () => {
  let component: OfferedUsersListComponent;
  let fixture: ComponentFixture<OfferedUsersListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferedUsersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
