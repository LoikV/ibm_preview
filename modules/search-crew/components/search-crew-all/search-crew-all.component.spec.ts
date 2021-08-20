import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchCrewAllComponent } from './search-crew-all.component';

describe('SearchCrewAllComponent', () => {
  let component: SearchCrewAllComponent;
  let fixture: ComponentFixture<SearchCrewAllComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCrewAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCrewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
