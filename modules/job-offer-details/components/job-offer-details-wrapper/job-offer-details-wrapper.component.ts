import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {AppRouterService} from '@core/services';
import {DestroySubscription, mainWrapper} from '@helpers';
import {
  ChangedStatusParams,
  ChangeHiredStatusParams,
  HiredStatus,
  JobOfferForSearchParams,
  JobOfferInputFormDto,
  JobOfferManageModalI,
  JobOfferModalMode,
  JobOffersListItemDto,
  PublishStatus,
  ResponseDto, UnpublishOfferParamsI, UnpublishReason
} from '@models';
import {translate} from '@ngneat/transloco';
import {BoatDetailsService, DirectoriesService} from '@services';
import {JobOffersService} from 'app/pages/boat-details/modules/boat-search-crew/modules/job-offers/services/job-offers.service';
import {combineLatest, EMPTY, Observable} from 'rxjs';
import {debounceTime, filter, map, switchMap, take, takeUntil} from 'rxjs/operators';
import {JobOfferManagerModalService} from '../../../job-offers-modal/services/job-offer-manager-modal.service';
import {JobOffersDetailsService} from '../../services/job-offer-details/job-offers-details.service';
import {SharedApiUrl, SharedTargetUrl} from '@shared/components/sharing';
import {
  ConfirmationDialogDataI,
  ConfirmationDialogService,
  ConfirmationDialogType
} from '@shared/modules/confirmation-dialog';
import {NotificationService} from '@shared/modules/notification';
import {UnpublishJobOfferModalService} from '@shared/components/unpublish-job-offer';
import {ChangeOfferPublishStatusService} from '../../../../services/change-offer-publish-status.service';

@Component({
  selector: 'app-job-offer-details-wrapper',
  templateUrl: './job-offer-details-wrapper.component.html',
  styleUrls: ['./job-offer-details-wrapper.component.scss']
})
export class JobOfferDetailsWrapperComponent extends DestroySubscription implements OnInit, OnDestroy, AfterViewInit {

  public offer$: Observable<JobOffersListItemDto>;
  public boatId: number | null;
  public shareConfig = {
    apiPath: SharedApiUrl.JobOffer,
    targetPath: SharedTargetUrl.JobOffer,
  };
  public UnpublishReason = UnpublishReason;

  @ViewChild('offeredUser') offeredUser: ElementRef<HTMLElement>;

  constructor(
    private readonly boatDetailsService: BoatDetailsService,
    private readonly appRouterService: AppRouterService,
    private readonly jobOffersService: JobOffersService,
    private readonly jobOffersDetailsService: JobOffersDetailsService,
    private readonly route: ActivatedRoute,
    private readonly jobOfferManagerModalService: JobOfferManagerModalService,
    private readonly notificationService: NotificationService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    protected readonly changeOfferPublishStatusService: ChangeOfferPublishStatusService,
    protected readonly directoriesService: DirectoriesService,
  ) {
    super();
    this.jobOffersDetailsService.init();
  }

  ngOnInit() {
    this.jobOffersService.init();
    this.boatId = this.boatDetailsService.boatId;
    this.getOffer();
    this.scrollToUserSection();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.jobOffersDetailsService.destroy();
  }

  public onGoToSearch(form: JobOfferInputFormDto): void {
    this.directoriesService.positionTypes$
      .pipe(
        take(1),
        takeUntil(this.destroyStream$)
      ).subscribe(
      positions => {
        const data = new JobOfferForSearchParams(form, positions);
        this.appRouterService.navigateToSearchCrew(`${this.boatId}`, data);
      }
    );
  }

  private getOffer(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    const parsedId = parseInt(id, 10);
    this.jobOffersDetailsService.updatedJobOfferId(parsedId);
    this.jobOffersService.updatedJobOfferId(parsedId);
    this.offer$ = this.jobOffersService.getMyJobOffer();
  }

  public onEditOffer(item: JobOffersListItemDto): void {
    this.editOffer(item);
  }

  public editOffer(item: JobOffersListItemDto): void {
    const changeHiredOfferParams = new ChangeHiredStatusParams(item.hired, item.published);
    this.openModal('edit', item.form, changeHiredOfferParams)
      .pipe(
        take(1),
        takeUntil(this.destroyStream$))
      .subscribe((data) => {
        if (!data) {
          return;
        }
        if (data.action === 'remove') {
          this.goToOffersList(item.published);
          return;
        }
        this.jobOffersService.updateJobOffer$.next();
      });
  }

  public changedOfferStatus(id: number, hired: HiredStatus, status: boolean, createdByCrewAgency: number | null) {
    const publishedStatus = status ? PublishStatus.Published : PublishStatus.UnPublished;
    const changeStatusData = new ChangedStatusParams(id, publishedStatus, hired, createdByCrewAgency);
    this.changeOfferPublishStatusService.onChangePublishStatus(changeStatusData)
      .pipe(
        take(1),
        takeUntil(this.destroyStream$)
      ).subscribe(res => {
      this.notifySuccessAndUpdate(res);
    });
  }

  private notifySuccessAndUpdate(response: ResponseDto): void {
    if (response) {
      this.notificationService.success(response.message);
    }
    this.jobOffersService.updateJobOffer$.next();
  }

  public openModal(
    mode: JobOfferModalMode = 'edit',
    item: JobOfferInputFormDto | null = null,
    changeHiredParams: ChangeHiredStatusParams | null = null
  ): Observable<any> {
    const config: JobOfferManageModalI<JobOfferInputFormDto> = {
      item,
      changeHiredParams,
      mode,
    };
    return this.jobOfferManagerModalService.open(config);
  }

  public onInviteCrew(offerId): void {
    this.appRouterService.navigateToAddCrew(`${this.boatId}`, {offerId});
  }

  public onJumpToTop(id: number): void {
    this.jobOffersService.jumpToTop(id)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe((res) => {
      if (res) {
        const message = translate('jobOffer.modal.jumpToTop');
        this.notificationService.info(message);
      }
    });
  }

  public goToOffersList(status: PublishStatus = PublishStatus.Published) {
    const boatId = this.boatId;
    status ? this.appRouterService.navigateToPublishOffers(`${boatId}`) : this.appRouterService.navigateToUnpublishOffers(`${boatId}`);
  }


  private scrollToUserSection(): void {
    combineLatest([
      this.route.queryParamMap,
      this.offer$,
    ]).pipe(
      debounceTime(0),
      take(1),
      takeUntil(this.destroyStream$)
    ).subscribe(([params]: [Params, JobOffersListItemDto]) => {
      if (params.get('target')) {
        this.navigateToOfferedUserSection();
      }
    });
  }

  private navigateToOfferedUserSection(): void {
    const wrapper = mainWrapper();
    if (!wrapper) {
      return;
    }
    const elRef = this.offeredUser;
    if (!elRef) {
      return;
    }
    const rect = elRef.nativeElement.getBoundingClientRect();
    const {top} = rect;
    wrapper.scrollTo({top, behavior: 'smooth'});
  }

}
