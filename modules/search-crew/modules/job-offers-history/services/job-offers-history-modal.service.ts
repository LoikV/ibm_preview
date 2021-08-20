import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {JobOffersHistoryComponent} from '../components/job-offers-history/job-offers-history.component';
import {JobOfferHistoryModalDataI} from '../models/job-offer-history-modal';
import {OverlayService} from '@shared/modules/modal';

@Injectable()
export class JobOffersHistoryModalService {

  constructor(
    private readonly overlayService: OverlayService,
  ) { }

  public open(data: JobOfferHistoryModalDataI): void {
    this.overlayService.open(
      JobOffersHistoryComponent,
      data,
      {
        panelClass: ['seaz-modal', 'seaz-modal__large', 'seaz-modal__offers_history'],
        backdropClass: ['seaz-background', 'modal-background'],
        hasBackdrop: true,
        disposeOnNavigation: true,
      },
    ).afterClosed$.pipe(
      map(event => event.data));
  }
}
