import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {ChangedStatusParams, HiredStatus, JobOfferInputFormDto, JobOffersListItemDto, PublishStatus} from '@models';
import {SharingPayloadParamsI} from '@shared/components/sharing';

@Component({
  selector: 'app-job-offers-item-preview',
  templateUrl: './job-offers-item-preview.component.html',
  styleUrls: ['./job-offers-item-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobOffersItemPreviewComponent implements OnInit, OnChanges {

  @Input() item: JobOffersListItemDto;
  @Output() inviteCrew = new EventEmitter<number>();
  @Output() goToOffer = new EventEmitter<number>();
  @Output() jumpToTop = new EventEmitter<number>();
  @Output() goToSearch = new EventEmitter<JobOfferInputFormDto>();
  @Output() edit = new EventEmitter<JobOffersListItemDto>();
  @Output() changePublishStatus = new EventEmitter<ChangedStatusParams>();

  public PublishStatus = PublishStatus;
  public sharingParams: SharingPayloadParamsI;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const item = this.item;
    if ('item' in changes && item) {
      this.sharingParams = this.createSharingParams();
    }
  }

  public onInviteCrew(id: number): void {
    this.inviteCrew.emit(id);
  }

  public onGoToSearch(): void {
    const form = this.item.form;
    this.goToSearch.emit(form);
  }

  public onGoToOffer(): void {
    this.goToOffer.emit(this.item.id);
  }

  public onJumpToTop(): void {
    this.jumpToTop.emit(this.item.id);
  }

  public onTogglePublishStatus(status: boolean, hired: HiredStatus, createdByCrewAgency: number | null): void {
    const publishedStatus = status ? PublishStatus.Published : PublishStatus.UnPublished;
    const changeStatusData = new ChangedStatusParams(this.item.id, publishedStatus, hired, createdByCrewAgency);
    this.changePublishStatus.emit(changeStatusData);
  }

  public onEdit(): void {
    this.edit.emit(this.item);
  }

  private createSharingParams(): SharingPayloadParamsI {
    const jobOfferId = this.item.id;
    return {jobOfferId};
  }
}
