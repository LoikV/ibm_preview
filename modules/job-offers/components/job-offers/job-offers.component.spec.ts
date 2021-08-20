import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobOffersComponent } from './job-offers.component';

describe('JobOffersComponent', () => {
  let component: JobOffersComponent;
  let fixture: ComponentFixture<JobOffersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
