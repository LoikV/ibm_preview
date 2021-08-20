import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslocoModule} from '@ngneat/transloco';
import {NewOffersActionsInfoService} from '@services/job-offers/new-actions-informations/new-offers-actions-info.service';
import {PermissionsModule} from '@shared/modules/permissions';
import {BoatFinancialHeaderModule} from '../boat-financial-header/boat-financial-header.module';
import {BoatSearchCrewRoutingModule} from './boat-search-crew-routing.module';
import {BoatSearchCrewComponent} from './components/boat-search-crew/boat-search-crew.component';
import {BoatSearchInfoComponent} from './components/boat-search-info/boat-search-info.component';
import {BoatSearchCrewPermissionGuard} from './guards/boat-search-crew-permission.guard';
import {BoatSearchCrewService} from './services/boat-search-crew.service';
import {NewActionsInformationsService} from './services/new-actions-informations/new-actions-informations.service';
import {JobOfferDirectoriesService} from '@services';
import {NavigationTabsModule} from '@shared/components/navigation-tabs';
import {InfoModalModule} from '@shared/modules/info-modal';
import {SeazoneIconRegistryService, SeazoneIconsModule, warningCircleIcon} from '@shared/modules/seazone-icons';
import {CustomLoaderModule} from '@shared/modules/custom-loader';
import {ChangeOfferPublishStatusService} from './services/change-offer-publish-status.service';
import {ConfirmationDialogModule} from '@shared/modules/confirmation-dialog';
import {UnpublishJobOfferModule} from '@shared/components/unpublish-job-offer';

@NgModule({
  declarations: [BoatSearchCrewComponent, BoatSearchInfoComponent],
  imports: [
    CommonModule,
    BoatSearchCrewRoutingModule,
    NavigationTabsModule,
    TranslocoModule,
    BoatFinancialHeaderModule,
    CustomLoaderModule,
    PermissionsModule,
    InfoModalModule,
    SeazoneIconsModule,
    ConfirmationDialogModule,
    UnpublishJobOfferModule,
  ],
  providers: [
    BoatSearchCrewService,
    BoatSearchCrewPermissionGuard,
    NewOffersActionsInfoService,
    NewActionsInformationsService,
    JobOfferDirectoriesService,
    ChangeOfferPublishStatusService,
  ],
})
export class BoatSearchCrewModule {
  constructor(private readonly seazoneIconRegistryService: SeazoneIconRegistryService) {
    this.seazoneIconRegistryService.registerIcons([warningCircleIcon
    ]);
  }
}
