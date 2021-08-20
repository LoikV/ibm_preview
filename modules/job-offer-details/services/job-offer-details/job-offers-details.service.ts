import {Injectable} from '@angular/core';
import {
  BoatJobOfferCountDto,
  CrewSearchUserRatingI,
  CrewSearchUserRatingPayload,
  JobOfferCountPayload,
  JobOffersListParams,
  JobOffersListPayload,
  JobOffersReadyListPagination,
  JobOffersReadyType,
  ResponseDto
} from '@models';
import {BoatDetailsService, CrewSearchService} from '@services';
import {JobOffersReadyApiService} from '@services/job-offers/job-offers-ready-list/job-offers-ready-api.service';
import {loader} from '@shared/modules/custom-loader/models/decorators';
import {BehaviorSubject, combineLatest, EMPTY, Observable, Subject} from 'rxjs';
import {debounceTime, filter, shareReplay, startWith, switchMap, tap} from 'rxjs/operators';
import {UserNoteFormI, UserNoteServiceI} from '@shared/modules/user-note';


@Injectable()
export class JobOffersDetailsService implements UserNoteServiceI {

  public offers$: Observable<JobOffersReadyListPagination>;
  private updateOffers$: Subject<void>;
  private offerType$: BehaviorSubject<JobOffersReadyType | null>;
  private offerParams$: BehaviorSubject<JobOffersListParams | null>;
  private jobOfferId$: BehaviorSubject<number | null>;
  private updateOffersCount$: Subject<void>;
  public offersCount$: Observable<BoatJobOfferCountDto>;

  constructor(
    private readonly jobOffersReadyApiService: JobOffersReadyApiService,
    private readonly boatDetailsService: BoatDetailsService,
    private readonly crewSearchService: CrewSearchService,
  ) {
  }

  public init() {
    this.updateOffers$ = new Subject();
    this.jobOfferId$ = new BehaviorSubject(null);
    this.offerType$ = new BehaviorSubject(null);
    this.offerParams$ = new BehaviorSubject(null);
    this.updateOffersCount$ = new Subject();
    this.offersCount$ = this.getOffersCount();
    this.offers$ = this.getJobOffers();
  }

  public destroy() {
    this.updateOffers$.complete();
    this.offerType$.complete();
    this.offerParams$.complete();
    this.jobOfferId$.complete();
  }

  private getJobOffers(): Observable<JobOffersReadyListPagination> {
    return combineLatest([
      this.offerParams$.pipe(filter(params => !!params)),
      this.boatDetailsService.boatId$,
      this.jobOfferId$.pipe(filter(id => !!id)),
      this.updateOffers$.pipe(startWith(null)),
    ]).pipe(
      switchMap(([params, boatId, jobOfferId]: [JobOffersListParams, number, number, void]) => {
        const type = this.offerType$.value;
        if (!type) {
          return EMPTY;
        }
        const {limit, page, sort} = params;
        const payload = new JobOffersListPayload(boatId, jobOfferId, page, params.filter, limit, sort);
        return this.jobOffersReadyApiService.getOffersReadyList(payload, type);
      }),
      shareReplay(1)
    );
  }

  public updateOffers(): void {
    this.updateOffers$.next();
  }

  public updateType(type: JobOffersReadyType) {
    this.offerType$.next(type);
  }

  public updateRouteParams(params: JobOffersListParams) {
    this.offerParams$.next(params);
  }

  public updatedJobOfferId(id: number): void {
    this.jobOfferId$.next(id);
  }

  public updateOffersCount(): void {
    this.updateOffersCount$.next();
  }

  @loader()
  public updateNote(form: UserNoteFormI): Observable<ResponseDto> {
    return this.boatDetailsService.boatId$
      .pipe(
        switchMap(boatId => {
          const {id, note} = form;
          return this.crewSearchService.updateCrewNote({boatId, note, userId: id});
        }),
        tap(() => this.updateOffers$.next())
      );
  }

  private getOffersCount(): Observable<BoatJobOfferCountDto> {
    return combineLatest([
      this.boatDetailsService.boatId$.pipe(filter(id => !!id)),
      this.jobOfferId$.pipe(filter(id => !!id)),
      this.offerType$.pipe(filter(type => !!type)),
      this.updateOffersCount$.pipe(startWith(null))
    ]).pipe(
      debounceTime(100),
      switchMap(([boatId, jobOfferId]: [number, number, JobOffersReadyType, void]) => {
        const payload = new JobOfferCountPayload(boatId, jobOfferId);
        return this.jobOffersReadyApiService.getOffersCount(payload);
      }),
      shareReplay(1),
    );
  }

  public viewSharedContacts(jobOfferInvitationId: number): Observable<ResponseDto> {
    return this.jobOffersReadyApiService.viewSharedContacts(jobOfferInvitationId);
  }

  public setOfferedCrewRating(data: CrewSearchUserRatingI): Observable<ResponseDto> {
    const {jobOfferInvitationId, rating} = data;
    return this.boatDetailsService.boatId$.pipe(
      switchMap(boatId => {
        const payload = new CrewSearchUserRatingPayload(boatId, jobOfferInvitationId, rating);
        return this.jobOffersReadyApiService.setOfferedCrewRating(payload);
      })
    );
  }
}
