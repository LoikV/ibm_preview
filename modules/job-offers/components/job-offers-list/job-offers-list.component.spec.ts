import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobOffersListComponent } from './job-offers-list.component';

describe('JobOffersListComponent', () => {
  let component: JobOffersListComponent;
  let fixture: ComponentFixture<JobOffersListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOffersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOffersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
