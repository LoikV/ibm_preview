import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchCrewFavoritesComponent } from './search-crew-favorites.component';

describe('SearchCrewFavoritesComponent', () => {
  let component: SearchCrewFavoritesComponent;
  let fixture: ComponentFixture<SearchCrewFavoritesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCrewFavoritesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCrewFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
