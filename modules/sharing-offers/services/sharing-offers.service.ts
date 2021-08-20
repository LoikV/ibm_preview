import {Inject, Injectable} from '@angular/core';
import {TransferHttpService} from '@gorniv/ngx-transfer-http';
import {SharingCandidatesSourceType, SharingOffersData, SharingOffersPayloadParams} from '../models/sharing-offers-group.model';
import {Observable} from 'rxjs/internal/Observable';
import {httpParamsFromObject} from '@helpers';
import {map, switchMap} from 'rxjs/operators';
import {ResponseDto} from '@models';
import {SharingOffersApiService} from '@services/job-offers/sharing-job-offer/sharing-offers-api-service';
import {BoatDetailsService} from '@services';
import {translate} from '@ngneat/transloco';
import {environment} from '@environments/environment';
import {NotificationService} from '@shared/modules/notification';
import {EMPTY, of, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharingOffersService {

  constructor(
    private readonly sharingOffersApiService: SharingOffersApiService,
    private readonly boatDetailsService: BoatDetailsService,
    private readonly notificationService: NotificationService,
  ) {
  }

  public getSharingCandidatesListForOffer(page: number, limit: number, jobOfferId: number): Observable<SharingOffersData> {
    if (!jobOfferId) {
      throwError('missing offerId');
      return EMPTY;
    }
    return this.sharingOffersApiService.getSharingCandidatesListForOffer(jobOfferId, page, limit);
  }

  public getSharingCandidatesListForFavorites(page: number, limit: number, boatId: number): Observable<SharingOffersData> {
    if (!boatId) {
      throwError('missing offerId');
      return EMPTY;
    }
    return this.sharingOffersApiService.getSharingCandidatesListForFavorites(page, limit, boatId);
  }

  public getSharingLink(payload: SharingOffersPayloadParams, type): Observable<string> {
    if (type === SharingCandidatesSourceType.JobOffer) {
      return this.sharingOffersApiService.getSharingLink(payload);
    }
    return this.sharingOffersApiService.getSharingFavoriteLink(payload);
  }

  // public addLinkToClipboard(hash): void {
  //   const path = this.createPath(hash);
  //   const textArea = document.createElement('textarea');
  //   const msg = translate('jobOffer.actions.sharedCandidates');
  //   textArea.value = path;
  //   document.body.appendChild(textArea);
  //   textArea.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(textArea);
  //   this.notificationService.info(msg);
  // }
  //
  // private createPath(hash: string) {
  //   const path = 'view-offer-actions';
  //   return `${environment.baseUrl}/${path}/?hash=${hash}`;
  // }
  }

