import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CrewSearchOfferHistoryItemDto, JobOfferInvitationType} from '@models';

@Component({
  selector: 'app-job-offers-history-item',
  templateUrl: './job-offers-history-item.component.html',
  styleUrls: ['./job-offers-history-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobOffersHistoryItemComponent implements OnInit, OnChanges {

  @Input() item: CrewSearchOfferHistoryItemDto;

  public isIncomingOffer: boolean;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    const item = this.item;
    if ('item' in changes && item) {
      this.isIncomingOffer = item.invitationType === JobOfferInvitationType.CREW;
    }
  }
  ngOnInit() {
  }

}
