import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SEAZONE_FORM_FIELD} from '@controls/seazone-form-field';
import {TranslocoModule} from '@ngneat/transloco';
import {StickyModule} from '@shared/directives';
import {BoatCrewJobOfferActionsModule} from '@shared/modules/boat-crew-job-offer-actions/boat-crew-job-offer-actions.module';
import {SEAZ_MODAL_CONFIG} from '@shared/modules/modal/classes/modal-data';
import {SearchMapModule, SearchMapService} from '@shared/modules/search-map';
import {SearchCrewProfileModule} from '../search-crew-profile/search-crew-profile.module';
import {SearchCrewAllComponent} from './components/search-crew-all/search-crew-all.component';
import {SearchCrewFavoritesComponent} from './components/search-crew-favorites/search-crew-favorites.component';
import {SearchCrewNotRelevantComponent} from './components/search-crew-not-relevant/search-crew-not-relevant.component';
import {SearchCrewWrapperComponent} from './components/search-crew-wrapper/search-crew-wrapper.component';
import {JobOffersHistoryModule} from './modules/job-offers-history/job-offers-history.module';
import {SearchCrewRoutingModule} from './search-crew-routing.module';
import {SearchCrewService} from './services/search-crew.service';
import {UpdateBoatLocationModalModule} from '@shared/components/update-boat-location-modal';
import {JobOffersModalModule} from '../job-offers-modal/job-offers-modal.module';
import {NavigationTabsModule} from '@shared/components/navigation-tabs';
import {likeIcon, mapIcon, SeazoneIconRegistryService, SeazoneIconsModule} from '@shared/modules/seazone-icons';
import {
  CrewSearchAdditionalFormModule,
  CrewSearchFilterModule,
  CrewSearchListModule,
  SEAZONE_LOCATION_FORM_CONFIG
} from '@shared/components/search';
import {CustomLoaderModule} from '@shared/modules/custom-loader';
import {ConfirmationDialogModule} from '@shared/modules/confirmation-dialog';
import {SEAZONE_RANGE_SLIDER_CONFIG} from '@controls/seazone-range-slider';
import {ModalModule} from '@shared/modules/modal';
import {SendJobOfferModule} from '@shared/components/send-job-offer';
import {UserNoteService} from '@shared/modules/user-note';
import {SharingOffersModule} from '../sharing-offers/sharing-offers.module';


@NgModule({
  declarations: [
    SearchCrewAllComponent,
    SearchCrewFavoritesComponent,
    SearchCrewNotRelevantComponent,
    SearchCrewWrapperComponent,
  ],
  imports: [
    CommonModule,
    SearchCrewRoutingModule,
    CrewSearchFilterModule,
    CrewSearchListModule,
    TranslocoModule,
    CustomLoaderModule,
    ModalModule,
    CrewSearchAdditionalFormModule,
    CustomLoaderModule,
    SearchMapModule,
    SeazoneIconsModule,
    StickyModule,
    NavigationTabsModule,
    ConfirmationDialogModule,
    SearchCrewProfileModule,
    SendJobOfferModule,
    JobOffersHistoryModule,
    BoatCrewJobOfferActionsModule,
    UpdateBoatLocationModalModule,
    JobOffersModalModule,
    SharingOffersModule,
  ],
  providers: [
    SearchCrewService,
    {
      provide: SEAZONE_FORM_FIELD,
      useValue: {
        direction: 'row',
        additionalClasses: ['seazone-form-field--wrapper'],
      }
    },
    {
      provide: SEAZ_MODAL_CONFIG,
      useValue: {
        panelClass: 'seaz-modal',
        backdropClass: 'seaz-background',
      }
    },
    {
      provide: SEAZONE_RANGE_SLIDER_CONFIG,
      useValue: {
        theme: 'seaz',
        activeThumbsWidth: 25,
        thumbsWidth: 25,
      }
    },
    {
      provide: SearchMapService,
      useExisting: SearchCrewService,
    },
    {
      provide: UserNoteService,
      useExisting: SearchCrewService,
    },
    {
      provide: SEAZONE_LOCATION_FORM_CONFIG,
      useValue: {
        step: 100,
        maxDistance: 20000,
        nearDistance: 500,
        showBoatLocation: true,
      },
    }
  ],
})
export class SearchCrewModule {
  constructor(
    private readonly seazoneIconRegistryService: SeazoneIconRegistryService,
  ) {
    this.seazoneIconRegistryService.registerIcons([likeIcon, mapIcon]);
  }
}
