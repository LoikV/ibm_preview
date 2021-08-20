import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SentContractComponent } from './sent-contract.component';

describe('SentContractComponent', () => {
  let component: SentContractComponent;
  let fixture: ComponentFixture<SentContractComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SentContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
