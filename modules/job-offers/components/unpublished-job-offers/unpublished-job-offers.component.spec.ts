import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnpublishedJobOffersComponent } from './unpublished-job-offers.component';

describe('UnpublishedJobOffersComponent', () => {
  let component: UnpublishedJobOffersComponent;
  let fixture: ComponentFixture<UnpublishedJobOffersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnpublishedJobOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpublishedJobOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
