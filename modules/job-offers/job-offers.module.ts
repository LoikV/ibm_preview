import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslocoModule} from '@ngneat/transloco';
import {NoDataModule} from '@shared/components/no-data/no-data.module';
import {UnpublishJobOfferModule} from '@shared/components/unpublish-job-offer/unpublish-job-offer.module';
import {CopyingModule} from '@shared/directives/copying/copying.module';
import {PermissionsModule} from '@shared/modules/permissions';
import {
  addPersonIcon,
  arrowBackFillIcon,
  arrowWideIcon,
  copyIcon,
  eyeIcon,
  longArrowIcon,
  pencilIcon,
  SeazoneIconRegistryService,
  SeazoneIconsModule,
  trashIcon
} from '@shared/modules/seazone-icons';
import {ArrayJoinModule} from '@shared/pipes/array-join/array-join.module';
import {JobOffersModalModule} from '../job-offers-modal/job-offers-modal.module';
import {JobOffersItemPreviewComponent} from './components/job-offers-item-preview/job-offers-item-preview.component';
import {JobOffersListHeaderComponent} from './components/job-offers-list-header/job-offers-list-header.component';
import {JobOffersListComponent} from './components/job-offers-list/job-offers-list.component';
import {JobOffersWrapperComponent} from './components/job-offers-wrapper/job-offers-wrapper.component';
import {JobOffersComponent} from './components/job-offers/job-offers.component';
import {UnpublishedJobOffersComponent} from './components/unpublished-job-offers/unpublished-job-offers.component';
import {JobOffersRoutingModule} from './job-offers-routing.module';
import {JobOffersService} from './services/job-offers.service';
import {SHARE_CONFIG, SharedApiUrl, SharedTargetUrl, SharingModule} from '@shared/components/sharing';
import {NavigationTabsModule} from '@shared/components/navigation-tabs';
import {CustomLoaderModule} from '@shared/modules/custom-loader';
import {SeazoneInputModule} from '@controls/seazone-input';
import {ToggleCheckboxModule} from '@controls/toggle-checkbox';
import {ConfirmationDialogModule} from '@shared/modules/confirmation-dialog';
import {ModalModule} from '@shared/modules/modal';
import {PaginatorModule} from '@shared/modules/paginator';
import {InfoLabelModule} from '@shared/components/info-label';
import {DisallowCrewAgencyModule} from '@shared/modules/disallow-crew-agency';

@NgModule({
  declarations: [
    JobOffersComponent,
    JobOffersListComponent,
    JobOffersListHeaderComponent,
    JobOffersItemPreviewComponent,
    UnpublishedJobOffersComponent,
    JobOffersWrapperComponent],
  imports: [
    CommonModule,
    JobOffersRoutingModule,
    SeazoneIconsModule,
    ToggleCheckboxModule,
    ReactiveFormsModule,
    SeazoneInputModule,
    ModalModule,
    TranslocoModule,
    ConfirmationDialogModule,
    PaginatorModule,
    NavigationTabsModule,
    NoDataModule,
    CustomLoaderModule,
    PermissionsModule,
    SharingModule,
    JobOffersModalModule,
    CopyingModule,
    ArrayJoinModule,
    InfoLabelModule,
    DisallowCrewAgencyModule,
  ],
  providers: [
    JobOffersService,
    {
      provide: SHARE_CONFIG,
      useValue: {
        apiPath: SharedApiUrl.JobOffer,
        targetPath: SharedTargetUrl.JobOffer,
      },
    }
  ],
})
export class JobOffersModule {
  constructor(private readonly seazoneIconRegistryService: SeazoneIconRegistryService) {
    this.seazoneIconRegistryService.registerIcons([
      pencilIcon,
      eyeIcon,
      trashIcon,
      addPersonIcon,
      longArrowIcon,
      copyIcon,
      arrowBackFillIcon,
      arrowWideIcon,
    ]);
  }
}
