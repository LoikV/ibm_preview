import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChangedStatusParams, JobOfferInputFormDto, JobOffersListItemDto} from '@models';
import {StubImages} from '@shared/directives/image-stub/image-stub.directive';

@Component({
  selector: 'app-job-offers-list',
  templateUrl: './job-offers-list.component.html',
  styleUrls: ['./job-offers-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobOffersListComponent implements OnInit {

  @Output() inviteCrew = new EventEmitter<number>();
  @Output() edit = new EventEmitter<JobOffersListItemDto>();
  @Output() changePublishStatus = new EventEmitter<ChangedStatusParams>();
  @Output() toOffer = new EventEmitter<number>();
  @Output() goToSearch = new EventEmitter<JobOfferInputFormDto>();
  @Output() jumpToTop = new EventEmitter<number>();
  @Input() jobOffers: JobOffersListItemDto[];

  public StubImages = StubImages;

  constructor() {
  }

  ngOnInit() {
  }

  public onInviteCrew(id: number): void {
    this.inviteCrew.emit(id);
  }

  public goToOffer(id: number) {
    this.toOffer.emit(id);
  }

  public onGoToSearch(data: JobOfferInputFormDto) {
    this.goToSearch.emit(data);
  }

  public onJumpToTop(offerId) {
    this.jumpToTop.emit(offerId);
  }

  public onEdit(data: JobOffersListItemDto): void {
    this.edit.emit(data);
  }

  public onChangePublishStatus(publishedData: ChangedStatusParams): void {
    this.changePublishStatus.emit(publishedData);
  }
}
