import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {ChangeSelectedOfferActionI, SharingCandidatesSourceType, SharingOffersData} from '../../models/sharing-offers-group.model';
import {JobOffersReadyType} from '@models';

@Component({
  selector: 'app-sharing-offers-list',
  templateUrl: './sharing-offers-list.component.html',
  styleUrls: ['./sharing-offers-list.component.scss']
})
export class SharingOffersListComponent implements OnInit {

  @Input() data: SharingOffersData;
  @Input() type: SharingCandidatesSourceType;
  @Output() changeSelected = new EventEmitter<ChangeSelectedOfferActionI>();
  @Output() changeSelectedFavorite = new EventEmitter<ChangeSelectedOfferActionI>();

  public sharingCandidatesSourceType = SharingCandidatesSourceType;

  constructor() { }

  ngOnInit(): void {
  }

  public selectUser(value: boolean, id: number): void {
    this.changeSelected.emit({value, id});
  }

  public selectFavoriteUser(value: boolean, id: number): void {
    this.changeSelected.emit({value, id});
  }
}
