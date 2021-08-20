import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslocoModule} from '@ngneat/transloco';
import {UnpublishJobOfferModule} from '@shared/components/unpublish-job-offer/unpublish-job-offer.module';
import {JobOfferModalComponent} from './components/job-offer-modal/job-offer-modal.component';
import {JobOfferManagerModalService} from './services/job-offer-manager-modal.service';
import {JobOfferManagerService} from './services/job-offer-manager.service';
import {JobOfferFormModule} from '@shared/components/job-offer-form';
import {ConfirmationDialogModule} from '@shared/modules/confirmation-dialog';
import {ModalModule, SEAZ_MODAL_CONFIG} from '@shared/modules/modal';
import {CustomLoaderModule} from '@shared/modules/custom-loader';

@NgModule({
  declarations: [JobOfferModalComponent],
  imports: [
    CommonModule,
    ModalModule,
    JobOfferFormModule,
    ConfirmationDialogModule,
    TranslocoModule,
    CustomLoaderModule,
    UnpublishJobOfferModule,
  ],
  entryComponents: [JobOfferModalComponent],
  providers: [
    JobOfferManagerService,
    JobOfferManagerModalService,
    {
      provide: SEAZ_MODAL_CONFIG,
      useValue: {
        panelClass: 'seaz-modal',
        backdropClass: 'seaz-background',
      }
    },
  ],
})
export class JobOffersModalModule { }
