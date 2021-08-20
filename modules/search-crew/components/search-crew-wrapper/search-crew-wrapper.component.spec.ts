import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchCrewWrapperComponent } from './search-crew-wrapper.component';

describe('SearchCrewWrapperComponent', () => {
  let component: SearchCrewWrapperComponent;
  let fixture: ComponentFixture<SearchCrewWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCrewWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCrewWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
