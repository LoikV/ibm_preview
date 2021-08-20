import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobOffersWrapperComponent } from './job-offers-wrapper.component';

describe('JobOffersWrapperComponent', () => {
  let component: JobOffersWrapperComponent;
  let fixture: ComponentFixture<JobOffersWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOffersWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOffersWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
