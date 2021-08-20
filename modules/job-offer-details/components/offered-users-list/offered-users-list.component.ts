import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  ChangeJobOfferDeclineStatusI,
  ConditionalStatus,
  CrewCvContactsDto, CrewSearchUserRatingI,
  JobOfferCardDto,
  JobOfferInvitationStatusType,
  JobOffersReadyListPagination,
  JobOfferStatusType,
  SendJobOfferAgainFormI,
  WatchContactsI
} from '@models';
import {StubImages} from '@shared/directives/image-stub/image-stub.directive';
import {GoToProfileDataI} from '../../models/job-offers-ready-page';
import {translate} from '@ngneat/transloco';
import {InfoModalService} from '@shared/modules/info-modal';

@Component({
  selector: 'app-offered-users-list',
  templateUrl: './offered-users-list.component.html',
  styleUrls: ['./offered-users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferedUsersListComponent implements OnInit {

  @Input() data: JobOffersReadyListPagination;
  @Output() changePage = new EventEmitter<number>();
  @Output() sendAgain = new EventEmitter<SendJobOfferAgainFormI>();
  @Output() goToProfile = new EventEmitter<GoToProfileDataI>();
  @Output() decline = new EventEmitter<ChangeJobOfferDeclineStatusI>();
  @Output() addAsCrew = new EventEmitter<number>();
  @Output() revise = new EventEmitter<number>();
  @Output() watchContacts = new EventEmitter<WatchContactsI>();
  @Output() seeContract = new EventEmitter<number>();
  @Output() resendInvite = new EventEmitter<string>();
  @Output() сancelInvitation = new EventEmitter<string>();
  @Output() setRating = new EventEmitter<CrewSearchUserRatingI>();

  public stubImages = StubImages;
  public JobOfferInvitationStatusType = JobOfferInvitationStatusType;

  constructor(
    private readonly  infoModalService: InfoModalService,
  ) {
  }

  ngOnInit() {
  }

  public onChangePage(page: number): void {
    this.changePage.emit(page);
  }

  public onSendAgain(jobOfferInvitationId: number, canSendOfferAgain: boolean): void {
    this.sendAgain.emit({jobOfferInvitationId, canSendOfferAgain});
  }

  public onGoToProfile(userId: number, jobOfferInvitationId: number): void {
    this.goToProfile.emit({userId, jobOfferInvitationId});
  }

  public onDecline(jobOfferInvitationId: number): void {
    this.decline.emit({jobOfferInvitationId, notRelevant: ConditionalStatus.NO});
  }

  public onAddCrew(jobOfferInvitationId: number): void {
    this.addAsCrew.emit(jobOfferInvitationId);
  }

  public onRevise(jobOfferInvitationId: number): void {
    this.revise.emit(jobOfferInvitationId);
  }

  public onWatchContacts(contacts: CrewCvContactsDto, jobOfferInvitationId: number, status: JobOfferStatusType): void {
    this.watchContacts.emit({contacts, jobOfferInvitationId, status});
  }

  public onResendInvitation(email: string): void {
    this.resendInvite.emit(email);
  }

  public onShowContract(contractInvitationId: number): void {
    this.seeContract.emit(contractInvitationId);
  }

  public onCancelInvitation(email: string): void {
    this.сancelInvitation.emit(email);
  }

  public onSetRating(rating: number, jobOfferInvitationId: number): void {
    this.setRating.emit({rating, jobOfferInvitationId});
  }

  public trackBy(index: number, item: JobOfferCardDto): number {
    return item.jobOfferId;
  }

  public onShowRatingModal(): void {
    const msg = translate('offeredUsers.ratingMsg');
    const title = translate('offeredUsers.ratingTitle');
    this.infoModalService.openSeazThemeModal(msg, title, false, null, true);
  }
}
