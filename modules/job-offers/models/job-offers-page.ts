import {Directive, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {AppRouterService} from '@core/services';
import {DestroySubscription} from '@helpers';
import {
  ChangedStatusParams,
  ChangeHiredStatusParams,
  JobOfferForSearchParams,
  JobOfferInputFormDto,
  JobOffersListItemDto,
  JobOffersListPagination,
  JobOffersParams,
  PublishStatus,
  ResponseDto
} from '@models';
import {translate} from '@ngneat/transloco';
import {BoatDetailsService, DirectoriesService} from '@services';
import {NewOffersActionsInfoService} from '@services/job-offers/new-actions-informations/new-offers-actions-info.service';
import {combineLatest, Observable, Subject} from 'rxjs';
import {shareReplay, startWith, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {JobOfferManagerModalService} from '../../job-offers-modal/services/job-offer-manager-modal.service';
import {JobOffersService} from '../services/job-offers.service';
import {ConfirmationDialogService} from '@shared/modules/confirmation-dialog';
import {NotificationService} from '@shared/modules/notification';
import {InfoModalService} from '@shared/modules/info-modal';
import {ChangeOfferPublishStatusService} from '../../../services/change-offer-publish-status.service';

@Directive()
export abstract class JobOffersPage extends DestroySubscription implements OnDestroy, OnInit {

  public searchParam: string | null;
  public offers$: Observable<JobOffersListPagination>;
  public updateOffers$ = new Subject<void>();

  public boatId: number | null;

  protected constructor(
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly appRouterService: AppRouterService,
    protected readonly jobOffersService: JobOffersService,
    protected readonly boatDetailsService: BoatDetailsService,
    protected readonly publishStatus: PublishStatus,
    protected readonly confirmationDialogService: ConfirmationDialogService,
    protected readonly jobOfferManagerModalService: JobOfferManagerModalService,
    protected readonly notificationService: NotificationService,
    protected readonly infoModalService: InfoModalService,
    protected readonly changeOfferPublishStatusService: ChangeOfferPublishStatusService,
    protected readonly directoriesService: DirectoriesService,
    protected readonly newOffersActionsInfoService: NewOffersActionsInfoService,
  ) {
    super();
    this.searchParam = this.getSearchParam();
  }

  ngOnInit() {
    this.boatId = this.boatDetailsService.boatId;
  }

  public getOffers(): void {
    this.offers$ = combineLatest([
      this.activatedRoute.queryParamMap,
      this.updateOffers$.asObservable().pipe(startWith(null))
    ]).pipe(
      switchMap(([queryParam]) => {
        const params = this.getRouteParams(queryParam);
        return this.jobOffersService.getJobOffers(params);
      }),
      tap((el: JobOffersListPagination) => {
        if (el.list && !el.list.length && el.pagination.currentPage > 1) {
          const page = el.pagination.currentPage - 1;
          this.onChangePage(page);
        }
      }),
      shareReplay(1),
    );
  }

  public addJobOffer(): void {
    this.jobOfferManagerModalService.openModal()
      .pipe(
        takeUntil(this.destroyStream$))
      .subscribe((data) => {
        if (data) {
          const {status} = data;
          if (status === null) {
            return;
          }
          const isPublish = status === PublishStatus.Published;
          const successCreateMsg = isPublish ? translate('jobOffer.modal.createPublishMsg')
            : translate('jobOffer.modal.createUnPublishMsg');
          this.infoModalService.openSeazThemeModal(successCreateMsg);
          this.checkCurrentPageAndUpdate(status);
        }
      });
  }

  public editOffer(item: JobOffersListItemDto): void {
    const changeHiredOfferParams = new ChangeHiredStatusParams(item.hired, item.published);
    const successEditMsg = translate('jobOffer.modal.updateMsg');
    const successDeleteMsg = translate('jobOffer.modal.deleteMsg');
    this.jobOfferManagerModalService.openModal('edit', item.form, changeHiredOfferParams)
      .pipe(
        takeUntil(this.destroyStream$))
      .subscribe((data) => {
        if (!data) {
          return;
        }
        if (data.action === 'remove') {
          this.notificationService.success(successDeleteMsg);
          this.updateOffers$.next();
          return;
        }
        const {status} = data;
        if (status === null) {
          return;
        }
        this.notificationService.success(successEditMsg);
        this.checkCurrentPageAndUpdate(status);
        this.newOffersActionsInfoService.updateActions();
      });
  }

  public changePublishStatus(data: ChangedStatusParams): void {
    this.changeOfferPublishStatusService.onChangePublishStatus(data)
      .pipe(
        take(1),
        takeUntil(this.destroyStream$)
      ).subscribe(res => {
      if (res) {
        this.notifySuccsessAndUpdate(res);
      }
    });
  }

  private notifySuccsessAndUpdate(response: ResponseDto): void {
    if (response) {
      this.notificationService.success(response.message);
    }
    this.updateOffers$.next();
    this.newOffersActionsInfoService.updateActions();
  }

  public checkCurrentPageAndUpdate(publishStatus: PublishStatus): void {
    if (publishStatus !== this.publishStatus) {
      this.goToAnotherPublishStatusPage();
      return;
    }
    const params = this.activatedRoute.snapshot.queryParams;
    if (params && params.page && +params.page !== 1) {
      this.onChangePage();
      return;
    }
    this.updateOffers$.next();
  }

  public checkForRedirectToFirstPage(): void {
    const params = this.activatedRoute.snapshot.queryParams;
    if (params && params.page && +params.page !== 1) {
      this.onChangePage();
      return;
    }
    this.updateOffers$.next();
  }

  public goToAnotherPublishStatusPage(): void {
    if (!this.boatId) {
      return;
    }
    switch (this.publishStatus) {
      case PublishStatus.Published:
        this.appRouterService.navigateToUnpublishOffers(this.boatId.toString());
        break;
      case PublishStatus.UnPublished:
        this.appRouterService.navigateToPublishOffers(this.boatId.toString());
        break;
    }
  }

  public getRouteParams(queryParams: ParamMap): JobOffersParams {
    const page = +(queryParams.get('page') || 1);
    const search = queryParams.get('search') || '';
    return new JobOffersParams(page, search, this.boatId, this.publishStatus, 10);
  }

  public onChangePage(page: number = 1) {
    this.navigateToRouteWithParams({page});
  }

  public onSearch(search: string): void {
    this.navigateToRouteWithParams({search});
  }

  public onGoToOffer(offerId: number): void {
    this.appRouterService.navigateToOffer(`${this.boatId}`, `${offerId}`);
  }

  public onJumpToTop(offerId: number): void {
    this.jobOffersService.jumpToTop(offerId)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe((res) => {
      if (res) {
        const message = translate('jobOffer.modal.jumpToTop');
        this.notificationService.info(message);
        this.updateOffers$.next();
      }
    });
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

  public navigateToRouteWithParams(params: Params): void {
    this.router.navigate(['.'], {relativeTo: this.activatedRoute, queryParams: params, queryParamsHandling: 'merge'});
  }

  public navigateToAddCrew(): void {
    this.appRouterService.navigateToAddCrew(`${this.boatId}`);
  }

  public sendInvite(offerId: number): void {
    this.appRouterService.navigateToAddCrew(`${this.boatId}`, {offerId});
  }

  public getSearchParam() {
    return this.activatedRoute.snapshot.queryParamMap.get('search') || null;
  }
}
