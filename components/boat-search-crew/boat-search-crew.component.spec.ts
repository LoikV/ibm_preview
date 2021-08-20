import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoatSearchCrewComponent } from './boat-search-crew.component';

describe('BoatSearchCrewComponent', () => {
  let component: BoatSearchCrewComponent;
  let fixture: ComponentFixture<BoatSearchCrewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatSearchCrewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatSearchCrewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
