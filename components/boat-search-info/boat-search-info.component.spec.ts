import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoatSearchInfoComponent } from './boat-search-info.component';

describe('BoatSearchInfoComponent', () => {
  let component: BoatSearchInfoComponent;
  let fixture: ComponentFixture<BoatSearchInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatSearchInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatSearchInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
