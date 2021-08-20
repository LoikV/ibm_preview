import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslocoModule} from '@ngneat/transloco';
import {CopyingModule} from '@shared/directives/copying/copying.module';
import {JobOffersHistoryItemComponent} from './components/job-offers-history-item/job-offers-history-item.component';
import {JobOffersHistoryComponent} from './components/job-offers-history/job-offers-history.component';
import {JobOffersHistoryModalService} from './services/job-offers-history-modal.service';
import {JobOffersHistoryService} from './services/job-offers-history.service';
import {ArrayJoinModule} from '@shared/pipes/array-join/array-join.module';
import {
  arrowTopBorderedIcon,
  copyIcon,
  longArrowIcon,
  SeazoneIconRegistryService,
  SeazoneIconsModule
} from '@shared/modules/seazone-icons';
import {ModalModule} from '@shared/modules/modal';
import {CustomLoaderModule} from '@shared/modules/custom-loader';
import {PaginatorModule} from '@shared/modules/paginator';

@NgModule({
  declarations: [JobOffersHistoryComponent, JobOffersHistoryItemComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    SeazoneIconsModule,
    CopyingModule,
    ModalModule,
    PaginatorModule,
    CustomLoaderModule,
    ArrayJoinModule,
  ],
  providers: [JobOffersHistoryModalService, JobOffersHistoryService],
  entryComponents: [JobOffersHistoryComponent],
})
export class JobOffersHistoryModule {
  constructor(
    private readonly seazoneIconRegistryService: SeazoneIconRegistryService,
  ) {
    this.seazoneIconRegistryService.registerIcons([
      copyIcon,
      longArrowIcon,
      arrowTopBorderedIcon,
    ]);
  }
}
