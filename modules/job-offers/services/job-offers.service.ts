import {Injectable} from '@angular/core';
import {
  AddJobOfferPayload,
  ChangedStatusParams,
  JobOfferFormMode,
  JobOfferInputFormDto,
  JobOffersDirectories,
  JobOffersListItemDto,
  JobOffersListPagination,
  JobOffersParams,
  JobOffersPayloadFormI,
  ResponseDto, UnpublishOfferParamsI,
} from '@models';
import {BoatDetailsService, DirectoriesService, JobOfferDirectoriesService} from '@services';
import {JobOffersApiService} from '@services/job-offers/job-offers-list/job-offers-api.service';
import {loader} from '@shared/modules/custom-loader/models/decorators';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {map, shareReplay, startWith, switchMap} from 'rxjs/operators';

@Injectable()
export class JobOffersService {

  public updateJobOffer$: Subject<void>;
  private jobOfferId$: BehaviorSubject<number | null>;

  public get directories$(): Observable<JobOffersDirectories> {
    return this.jobOfferDirectoriesService.getDirectories();
  }

  constructor(
    private readonly directoriesService: DirectoriesService,
    private readonly boatDetailsService: BoatDetailsService,
    private readonly jobOffersService: JobOffersApiService,
    private readonly jobOfferDirectoriesService: JobOfferDirectoriesService,
  ) {
  }

  public getJobOffers(params: JobOffersParams): Observable<JobOffersListPagination> {
    return this.jobOffersService.getJobOffers(params).pipe(
      map(data => new JobOffersListPagination(data)),
    );
  }

  public getJobOffer(id: number): Observable<JobOffersListItemDto> {
    return this.jobOffersService.getJobOffer(id).pipe(map(item => new JobOffersListItemDto(item)));
  }

  public getMyJobOffer(): Observable<JobOffersListItemDto> {
    return combineLatest([
      this.jobOfferId$,
      this.updateJobOffer$.pipe(startWith(null))
    ]).pipe(
      switchMap(([id]: [number, void]) => {
        return this.jobOffersService.getJobOffer(id).pipe(map(item => new JobOffersListItemDto(item)));
      }),
      shareReplay(1),
    );
  }

  public saveJobOffer(data: JobOffersPayloadFormI, mode: JobOfferFormMode) {
    if (mode === 'edit') {
      return this.editJobOffer(data);
    }
    return this.addJobOffer(data);
  }

  @loader()
  public getJobOfferFormData(id: number): Observable<JobOfferInputFormDto> {
    return this.jobOffersService.getJobOfferFormData(id).pipe(
      map(data => new JobOfferInputFormDto(data)),
    );
  }


  @loader()
  public addJobOffer(data: JobOffersPayloadFormI): Observable<any> {
    return this.boatDetailsService.boatId$.pipe(
      switchMap(id => {
        const payload = new AddJobOfferPayload(id, data);
        return this.jobOffersService.addJobOffer(payload);
      })
    );
  }

  @loader()
  public editJobOffer(data: JobOffersPayloadFormI): Observable<any> {
    return this.boatDetailsService.boatId$.pipe(
      switchMap(id => {
        const payload = new AddJobOfferPayload(id, data);
        return this.jobOffersService.updateJobOffer(payload);
      })
    );
  }

  @loader()
  public removeOffer(id: number): Observable<ResponseDto> {
    return this.jobOffersService.removeJobOffer(id);
  }

  @loader()
  public jumpToTop(id: number): Observable<ResponseDto> {
    return this.jobOffersService.jumpToTop(id);
  }

  public updatedJobOfferId(id: number): void {
    this.jobOfferId$.next(id);
  }

  public init() {
    this.updateJobOffer$ = new Subject();
    this.jobOfferId$ = new BehaviorSubject(null);
  }

  public destroy() {
    // this.destroySubject.complete();
    this.updateJobOffer$.complete();
    this.jobOfferId$.complete();
  }
}
