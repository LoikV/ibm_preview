import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobOffersHistoryComponent } from './job-offers-history.component';

describe('JobOffersHistoryComponent', () => {
  let component: JobOffersHistoryComponent;
  let fixture: ComponentFixture<JobOffersHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOffersHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOffersHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
