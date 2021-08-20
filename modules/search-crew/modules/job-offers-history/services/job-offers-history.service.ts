import {Injectable} from '@angular/core';
import {CrewSearchOfferPaginationParams, CrewSearchOffersHistoryDto} from '@models';
import {BoatDetailsService} from '@services';
import {JobOffersApiService} from '@services/job-offers/job-offers-list/job-offers-api.service';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable()
export class JobOffersHistoryService {

  constructor(
    private readonly jobOffersApiService: JobOffersApiService,
    private readonly boatDetailsService: BoatDetailsService,
  ) { }

  public getJobOfferHistory(userId: number, params: CrewSearchOfferPaginationParams)
    : Observable<CrewSearchOffersHistoryDto> {
    return this.boatDetailsService.boatId$
      .pipe(
        switchMap(boatId => this.jobOffersApiService.getJobOfferHistory({boatId, userId, ...params})),
      );
  }
}
