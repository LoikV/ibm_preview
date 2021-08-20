import {Injectable} from '@angular/core';
import {ChangeHiredStatusParams, JobOfferInputFormDto, JobOfferManageModalI, JobOfferModalMode} from '@models';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {JobOfferModalComponent} from '../components/job-offer-modal/job-offer-modal.component';
import {JobOfferModalClosePayload} from '../models/job-offer-modal';
import {OverlayService} from '@shared/modules/modal';

@Injectable()
export class JobOfferManagerModalService {

  constructor(
    private readonly overlayService: OverlayService,
  ) {
  }

  public openModal(
    mode: JobOfferModalMode = 'add',
    item: JobOfferInputFormDto | null = null,
    changeHiredParams: ChangeHiredStatusParams | null = null
  ): Observable<JobOfferModalClosePayload> {
    const config: JobOfferManageModalI<JobOfferInputFormDto> = {
      item,
      changeHiredParams,
      mode
    };
    return this.open(config)
      .pipe(
        take(1)
      );
  }

  public open(data: JobOfferManageModalI<JobOfferInputFormDto>): Observable<JobOfferModalClosePayload> {
    return this.overlayService.open(
      JobOfferModalComponent,
      data,
      {
        panelClass: ['seaz-modal__large', 'seaz-modal__offer_wrapp'],
        disposeOnNavigation: true,
      },
      {
        preventBackdropClick: true,
      }
    ).afterClosed$
      .pipe(
        map(event => event.data)
      );
  }
}
