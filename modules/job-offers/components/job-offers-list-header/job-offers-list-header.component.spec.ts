import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobOffersListHeaderComponent } from './job-offers-list-header.component';

describe('JobOffersListHeaderComponent', () => {
  let component: JobOffersListHeaderComponent;
  let fixture: ComponentFixture<JobOffersListHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOffersListHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOffersListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
