import {Injectable} from '@angular/core';
import {TransferHttpService} from '@gorniv/ngx-transfer-http';
import {buildURLParams} from '@helpers';
import {JobOffersNewActionsI, ResponseDto} from '@models';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class NewActionsInformationsService {
  private readonly apiUrl = 'api/job-offer';

  constructor(private readonly http: TransferHttpService) { }

  public getNewActionsInfo(boatId): Observable<JobOffersNewActionsI> {
    const params = buildURLParams({boatId});
    return this.http.get<ResponseDto<JobOffersNewActionsI>>(`${this.apiUrl}/get-job-offers-activities`, {params}).pipe(
      map(res => res.data)
    );
  }
}
