import {Directive, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, QueryParamsHandling, Router} from '@angular/router';
import {DestroySubscription} from '@helpers';
import {CrewSearchListDto, CrewSearchType, PaginationDto, SendCrewJobOfferI} from '@models';
import {BoatCrewJobOfferActionsService} from '@shared/modules/boat-crew-job-offer-actions';
import {Observable, Subject} from 'rxjs';
import {shareReplay, take, takeUntil, tap} from 'rxjs/operators';
import {JobOffersHistoryModalService} from '../modules/job-offers-history/services/job-offers-history-modal.service';
import {SearchCrewService} from '../services/search-crew.service';

@Directive()
export class SearchCrewBaseComponent extends DestroySubscription implements OnDestroy {

  public list$: Observable<CrewSearchListDto | null>;
  public crewSearchType: CrewSearchType;
  public sentOfferId$ = new Subject<number | null>();

  constructor(
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly searchCrewService: SearchCrewService,
    protected readonly type: CrewSearchType,
    protected readonly jobOffersHistoryModalService: JobOffersHistoryModalService,
    protected readonly boatCrewJobOfferActionsService: BoatCrewJobOfferActionsService,
  ) {
    super();
    this.crewSearchType = this.type;
    this.searchCrewService.setSearchType(this.type);
    this.onQueryParamsChanges();
    this.list$ = this.searchCrewService.list$.pipe(
      tap((list) => this.checkForOutPageParam(list)),
      shareReplay(1)
    );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.sentOfferId$.complete();
  }

  public onChangePage(page: number): void {
    this.setQueryParam({page});
  }

  public onGoToProfile(userId: number): void {
    this.router.navigate(['./', 'profile'], {relativeTo: this.activatedRoute, queryParams: {userId}});
  }

  public onSendJobOffer(payload: SendCrewJobOfferI): void {
    const {userId, userName} = payload;
    const offerParam = this.getRouteQueryParamByName('offer');
    const offerId = offerParam ? Number(offerParam) : null;
    this.boatCrewJobOfferActionsService.onSendJobOffer(userId, userName, offerId)
      .pipe(
        take(1),
        takeUntil(this.destroyStream$)
      ).subscribe(res => {
      if (res) {
        this.searchCrewService.updateOfferCount();
        this.searchCrewService.updateHasHistoryInListByUserId(userId);
        this.sentOfferId$.next(userId);
        this.addTimeoutOfferIdReset();
      }
    });
  }

  public onShowHistory(userId: number): void {
    this.jobOffersHistoryModalService.open({userId});
  }

  protected onQueryParamsChanges(): void {
    this.activatedRoute.queryParams
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe((params) => this.searchCrewService.onChangeQueryParams(params));
  }


  protected setQueryParam(params: Params, blockScroll = false, handling: QueryParamsHandling = 'merge'): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: handling,
      state: blockScroll ? {blockScroll} : {},
    });
  }

  private checkForOutPageParam(list: CrewSearchListDto | null): void {
    if (!list) {
      return;
    }
    const isOutPageParam = this.isOutPageParam(list.pagination);
    if (isOutPageParam) {
      this.setQueryParam({page: 1});
    }
  }

  private isOutPageParam(pagination: PaginationDto): boolean {
    if (pagination.pageCount === 0) {
      return false;
    }
    return pagination.currentPage > pagination.pageCount;
  }

  private addTimeoutOfferIdReset(): void {
    setTimeout(() => this.sentOfferId$.next(null), 5000);
  }

  protected getRouteQueryParamByName(name: string): string | null {
    const params = this.activatedRoute.snapshot.queryParamMap;
    return params.get(name);
  }

}
