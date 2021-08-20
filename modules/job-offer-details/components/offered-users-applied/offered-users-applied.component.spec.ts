import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferedUsersAppliedComponent } from './offered-users-applied.component';

describe('OfferedUsersAppliedComponent', () => {
  let component: OfferedUsersAppliedComponent;
  let fixture: ComponentFixture<OfferedUsersAppliedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferedUsersAppliedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedUsersAppliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
