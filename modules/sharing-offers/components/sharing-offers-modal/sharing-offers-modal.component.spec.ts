import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingOffersModalComponent } from './sharing-offers-modal.component';

describe('SharingOffersModalComponent', () => {
  let component: SharingOffersModalComponent;
  let fixture: ComponentFixture<SharingOffersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharingOffersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharingOffersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
