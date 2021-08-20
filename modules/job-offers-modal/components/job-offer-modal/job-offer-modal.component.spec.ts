import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobOfferModalComponent } from './job-offer-modal.component';

describe('JobOfferModalComponent', () => {
  let component: JobOfferModalComponent;
  let fixture: ComponentFixture<JobOfferModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOfferModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOfferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
