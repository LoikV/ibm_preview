import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferedUsersComponent } from './offered-users.component';

describe('OfferedUsersComponent', () => {
  let component: OfferedUsersComponent;
  let fixture: ComponentFixture<OfferedUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
