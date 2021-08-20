import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchCrewProfileComponent } from './search-crew-profile.component';

describe('PreviewUserProfileComponent', () => {
  let component: SearchCrewProfileComponent;
  let fixture: ComponentFixture<SearchCrewProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCrewProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCrewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
