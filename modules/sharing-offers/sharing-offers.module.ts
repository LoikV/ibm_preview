import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharingOffersModalComponent } from './components/sharing-offers-modal/sharing-offers-modal.component';
import { SharingOffersListComponent } from './components/sharing-offers-list/sharing-offers-list.component';
import {SharingOffersService} from './services/sharing-offers.service';
import {SharingOffersApiService} from '@services/job-offers/sharing-job-offer/sharing-offers-api-service';
import {TranslocoModule} from '@ngneat/transloco';
import {LookingJobSatusModule} from '@shared/components/looking-job-satus';
import {DaysAgoModule} from '@shared/pipes/days-ago/days-ago.module';
import {SeazoneCheckboxModule} from '@controls/seazone-checkbox';
import {PaginatorModule} from '@shared/modules/paginator';
import {OfferedStatusModule} from '@shared/components/offered-status';
import {SharingJobOfferActionsCardModule} from '@shared/components/sharing-job-offer-actions-card/sharing-job-offer-actions-card.module';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    SharingOffersModalComponent,
    SharingOffersListComponent,
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    SeazoneCheckboxModule,
    PaginatorModule,
    OfferedStatusModule,
    SharingJobOfferActionsCardModule,
    DaysAgoModule,
    LookingJobSatusModule,
    ReactiveFormsModule,
  ],
  exports: [
    SharingOffersModalComponent
  ],
  providers: [
    SharingOffersService,
    SharingOffersApiService
  ]
})
export class SharingOffersModule { }
