import { OnInit, Directive } from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {AppRouterService} from '@core/services';
import {DestroySubscription} from '@helpers';
import {
  ChangeJobOfferDeclineStatusI,
  CrewSearchUserRatingI,
  JobOfferNavItem,
  JobOffersListParams,
  JobOffersReadyListPagination,
  JobOffersReadyType,
  JobOfferStatusType,
  OfferedUsersSortType,
  SendJobOfferAgainFormI,
  WatchContactsI
} from '@models';
import {BoatDetailsService} from '@services';
import {BoatCrewJobOfferActionsService} from '@shared/modules/boat-crew-job-offer-actions';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, startWith, take, takeUntil, tap} from 'rxjs/operators';
import {JobOffersDetailsService} from '../services/job-offer-details/job-offers-details.service';
import {OverlayService} from '@shared/modules/modal';


export interface GoToProfileDataI {
  userId: number;
  jobOfferInvitationId: number;
}
@Directive()
export abstract class JobOffersReadyBaseComponent extends DestroySubscription implements OnInit {

  public offers$: Observable<JobOffersReadyListPagination>;
  public updateOffers$ = new Subject<void>();
  public choosenFilterControl = new FormControl(null);
  abstract navItems: JobOfferNavItem[];
  public navItems$: Observable<JobOfferNavItem[]>;

  constructor(
    protected readonly type: JobOffersReadyType,
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly boatDetailsService: BoatDetailsService,
    protected readonly jobOffersDetailsService: JobOffersDetailsService,
    protected readonly appRouterService: AppRouterService,
    protected readonly overlayService: OverlayService,
    protected readonly boatCrewJobOfferActionsService: BoatCrewJobOfferActionsService,
  ) {
    super();
    this.jobOffersDetailsService.updateType(this.type);
    this.setInitialChoosenType();
  }

  ngOnInit() {
    this.onFilterTypeChanges();
    this.changeParams();
    this.getOffersList();
    this.getNavigationWithCount();
  }

  private changeParams() {
    this.activatedRoute.queryParamMap
      .pipe(
        takeUntil(this.destroyStream$)
      )
      .subscribe((queryParams) => {
        const routeParams = this.getRouteParams(queryParams);
        this.jobOffersDetailsService.updateRouteParams(routeParams);
      });
  }


  public getOffersList(): void {
    this.offers$ = this.jobOffersDetailsService.offers$.pipe(
      tap((el: JobOffersReadyListPagination) => {
        if (el.list && !el.list.length && el.pagination.currentPage > 1) {
          const page = el.pagination.pageCount;
          this.onChangePage(page);
        }
        this.jobOffersDetailsService.updateOffersCount();
      })
    );
  }

  public getRouteParams(queryParams: ParamMap): JobOffersListParams {
    const page = +(queryParams.get('page') || 1);
    const readyStatus = queryParams.get('filter');
    const sort = +(queryParams.get('sort') || OfferedUsersSortType.LastAction);
    const transformReadystatus = readyStatus ? +readyStatus : 0;
    return new JobOffersListParams(page, transformReadystatus, 10, sort);
  }

  public onChangePage(page: number = 1) {
    this.navigateToRouteWithParams({page}, true);
  }

  public onSendAgain(form: SendJobOfferAgainFormI): void {
    this.boatCrewJobOfferActionsService.onSendAgain(form)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe((res) => {
      if (res) {
        this.jobOffersDetailsService.updateOffers();
      }
    });
  }

  public onGoToProfile(data: GoToProfileDataI): void {
    const boatId = this.boatDetailsService.boatId;
    if (!boatId) {
      return;
    }
    this.appRouterService.toSearchUserProfile(`${boatId}`, `${data.userId}`, `${data.jobOfferInvitationId}`);
  }

  public onSeeContract(contractId: number) {
    const boatId = this.boatDetailsService.boatId;
    if (!boatId) {
      return;
    }
    this.appRouterService.toSeeSearchUserContract(boatId, contractId);
  }

  public onDecline(form: ChangeJobOfferDeclineStatusI): void {
    this.boatCrewJobOfferActionsService.onDecline(form)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe((res) => {
      if (res) {
        this.jobOffersDetailsService.updateOffers();
        this.jobOffersDetailsService.updateOffersCount();
      }
    });
  }

  public onRevise(jobOfferInvitationId: number): void {
    this.boatCrewJobOfferActionsService.onRevise(jobOfferInvitationId)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe((res) => {
      if (res) {
        this.jobOffersDetailsService.updateOffers();
        this.jobOffersDetailsService.updateOffersCount();
      }
    });
  }

  public onResendInvitation(email: string): void {
    this.boatCrewJobOfferActionsService.onResendInvitation(email).pipe(
      takeUntil(this.destroyStream$)
    ).subscribe((res) => {
      if (res) {
        this.jobOffersDetailsService.updateOffers();
        this.jobOffersDetailsService.updateOffersCount();
      }
    });
  }


  public onCancelInvitation(email: string): void {
    this.boatCrewJobOfferActionsService.onCancelInvitation(email).pipe(
      takeUntil(this.destroyStream$)
    ).subscribe((res) => {
      if (res) {
        this.jobOffersDetailsService.updateOffers();
        this.jobOffersDetailsService.updateOffersCount();
      }
    });
  }

  public onAddCrew(jobOfferInvitationId: number): void {
    this.boatCrewJobOfferActionsService.onAddCrew(jobOfferInvitationId);
  }

  public onSetRating(data: CrewSearchUserRatingI): void {
    this.jobOffersDetailsService.setOfferedCrewRating(data)
      .pipe(
        take(1),
        takeUntil(this.destroyStream$)
      ).subscribe();
  }

  public navigateToRouteWithParams(queryParams: Params, blockScroll = false): void {
    this.router.navigate(
      ['.'],
      {relativeTo: this.activatedRoute, queryParams, queryParamsHandling: 'merge', state: {blockScroll}});
  }

  public onChooseType(val: JobOfferStatusType | null): void {
    this.choosenFilterControl.setValue(val);
  }

  public trackByTitle(index: number, item: JobOfferNavItem): string {
    return item.title;
  }

  private setInitialChoosenType(): void {
    const params = this.activatedRoute.snapshot.queryParamMap;
    const filter = params.get('filter');
    if (!filter) {
      return;
    }
    const value = parseInt(filter, 10);
    if (isNaN(value)) {
      return;
    }
    this.choosenFilterControl.setValue(value, {emitEvent: false});
  }

  private onFilterTypeChanges(): void {
    this.choosenFilterControl.valueChanges
      .pipe(
        tap(() => this.onChangePage()),
        distinctUntilChanged(),
        debounceTime(100),
        takeUntil(this.destroyStream$),
      ).subscribe(val => this.onChangeType(val));
  }

  public onWatchContacts(data: WatchContactsI): void {
    this.boatCrewJobOfferActionsService.onWatchContacts(data).pipe(
      takeUntil(this.destroyStream$)
    ).subscribe(() => {
      this.jobOffersDetailsService.updateOffers();
      this.jobOffersDetailsService.updateOffersCount();
    });
  }

  private onChangeType(filter: JobOfferStatusType | null): void {
    this.navigateToRouteWithParams({filter}, true);
  }

  private getNavigationWithCount(): void {
    this.navItems$ = this.jobOffersDetailsService.offersCount$
      .pipe(
        map(stats => {
          const statsByType = stats[this.type];
          const actionsStatsByType = stats[`${this.type}Actions`];
          if (!statsByType) {
            return this.navItems;
          }
          return this.navItems.map(item => {
            const keys = Object.keys(statsByType);
            const key = keys.find((k) => item.type === k);
            if (key) {
              const count = statsByType[key];
              const actionsCount = actionsStatsByType[key] || 0;
              return {...item, count, actionsCount};
            }
            return item;
          });
        }),
        startWith(this.navItems),
      );
  }

}
