import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchCrewNotRelevantComponent } from './search-crew-not-relevant.component';

describe('SearchCrewNotRelevantComponent', () => {
  let component: SearchCrewNotRelevantComponent;
  let fixture: ComponentFixture<SearchCrewNotRelevantComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCrewNotRelevantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCrewNotRelevantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
