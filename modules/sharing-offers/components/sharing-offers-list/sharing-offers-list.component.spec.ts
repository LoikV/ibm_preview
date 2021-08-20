import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingOffersListComponent } from './sharing-offers-list.component';

describe('SharingOffersListComponent', () => {
  let component: SharingOffersListComponent;
  let fixture: ComponentFixture<SharingOffersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharingOffersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharingOffersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
