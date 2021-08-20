import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobOfferDetailsWrapperComponent } from './job-offer-details-wrapper.component';

describe('JobOfferDetailsWrapperComponent', () => {
  let component: JobOfferDetailsWrapperComponent;
  let fixture: ComponentFixture<JobOfferDetailsWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOfferDetailsWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOfferDetailsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
