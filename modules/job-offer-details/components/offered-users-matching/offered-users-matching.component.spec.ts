import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferedUsersMatchingComponent } from './offered-users-matching.component';

describe('OfferedUsersMatchingComponent', () => {
  let component: OfferedUsersMatchingComponent;
  let fixture: ComponentFixture<OfferedUsersMatchingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferedUsersMatchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedUsersMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
