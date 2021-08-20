import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferedUsersSentComponent } from './offered-users-sent.component';

describe('OfferedUsersSentComponent', () => {
  let component: OfferedUsersSentComponent;
  let fixture: ComponentFixture<OfferedUsersSentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferedUsersSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedUsersSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
