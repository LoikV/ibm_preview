import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobOffersItemPreviewComponent } from './job-offers-item-preview.component';

describe('JobOffersItemPreviewComponent', () => {
  let component: JobOffersItemPreviewComponent;
  let fixture: ComponentFixture<JobOffersItemPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOffersItemPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOffersItemPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
