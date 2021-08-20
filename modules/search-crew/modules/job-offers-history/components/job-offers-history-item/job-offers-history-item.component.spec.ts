import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobOffersHistoryItemComponent } from './job-offers-history-item.component';

describe('JobOffersHistoryItemComponent', () => {
  let component: JobOffersHistoryItemComponent;
  let fixture: ComponentFixture<JobOffersHistoryItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOffersHistoryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOffersHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
