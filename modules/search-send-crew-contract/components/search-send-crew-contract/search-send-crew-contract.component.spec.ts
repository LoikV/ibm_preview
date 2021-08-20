import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchSendCrewContractComponent } from './search-send-crew-contract.component';

describe('SearchSendCrewContractComponent', () => {
  let component: SearchSendCrewContractComponent;
  let fixture: ComponentFixture<SearchSendCrewContractComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSendCrewContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSendCrewContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
