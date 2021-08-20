import {Injectable} from '@angular/core';
import {ChangedStatusParams, ChangeStatusPayload, PublishStatus, ResponseDto} from '@models';
import {translate} from '@ngneat/transloco';
import {ConfirmationDialogDataI, ConfirmationDialogService, ConfirmationDialogType} from '@shared/modules/confirmation-dialog';
import {switchMap} from 'rxjs/operators';
import {EMPTY} from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';
import {loader} from '@shared/modules/custom-loader/models/decorators';
import {JobOffersApiService} from '@services/job-offers';
import {UnpublishJobOfferModalService} from '@shared/components/unpublish-job-offer';

@Injectable()
export class ChangeOfferPublishStatusService {

  constructor(
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly jobOffersApiService: JobOffersApiService,
    private readonly unpublishJobOfferModalService: UnpublishJobOfferModalService,
  ) {
  }

  public onChangePublishStatus(data: ChangedStatusParams): Observable<ResponseDto> {
    if (data && data.hired && data.published) {
      return this.changeHiredUnpublishStatus(data);
    }
    return this.changeSimpleStatus(data);
  }

  private changeHiredUnpublishStatus(data: ChangedStatusParams): Observable<ResponseDto> {
    const title = translate('jobOffer.modal.publishOfferMsg');
    const config: ConfirmationDialogDataI = {
      title,
      applyAction: translate('jobOffer.actions.publish'),
      translate: false,
      type: ConfirmationDialogType.ATTENTION
    };
    return this.confirmationDialogService.openAndConfirm(config).pipe(
      switchMap(res => {
        if (res) {
          return this.changePublishStatus(data);
        }
        return EMPTY;
      })
    );
  }

  private changeSimpleStatus(data: ChangedStatusParams): Observable<ResponseDto> {
    if (data.published === PublishStatus.UnPublished) {
      return this.changeStatusToUnpublish(data);
    }
    return this.changePublishStatus(data);
  }

  private changeStatusToUnpublish(data: ChangedStatusParams): Observable<ResponseDto> {
    const {id, createdByCrewAgency} = data;
    return this.unpublishJobOfferModalService.open({offerId: id, createdByCrewAgency}).pipe(
      switchMap(res => {
        if (!res) {
          return EMPTY;
        }
        const params: ChangedStatusParams = {...data, updateCrew: res.updateCrew, reason: res.reason};
        const payload = new ChangeStatusPayload(params);
        return this.changePublishStatus(payload);
      }),
    );
  }

  @loader()
  private changePublishStatus(data: ChangeStatusPayload): Observable<ResponseDto> {
    return this.jobOffersApiService.changePublishStatus(data);
  }
}
