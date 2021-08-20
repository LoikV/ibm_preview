import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslocoModule} from '@ngneat/transloco';
import {JobOffersApiService} from '@services/job-offers/job-offers-list/job-offers-api.service';
import {BoatShortInfoCardModule} from '@shared/components/boat-short-info-card/boat-short-info-card.module';
import {CrewJobOfferCardModule} from '@shared/components/crew-job-offer-card/crew-job-offer-card.module';
import {NoDataModule} from '@shared/components/no-data/no-data.module';
import {UnpublishJobOfferModule} from '@shared/components/unpublish-job-offer/unpublish-job-offer.module';
import {ScrollControlsModule, ScrollToActiveLinkModule} from '@shared/directives';
import {BoatCrewJobOfferActionsModule} from '@shared/modules/boat-crew-job-offer-actions';
import {PermissionsModule} from '@shared/modules/permissions';
import {
  emailIcon,
  linkedinIcon, longArrowIcon,
  phoneIcon,
  searchIcon,
  SeazoneIconRegistryService,
  SeazoneIconsModule,
  shevronIcon,
  skypeIcon
} from '@shared/modules/seazone-icons';
import {JobOffersService} from 'app/pages/boat-details/modules/boat-search-crew/modules/job-offers/services/job-offers.service';
import {BoatCrewService} from '../../../my-crew/services/boat-сrew/boat-crew.service';
import {JobOffersModalModule} from '../job-offers-modal/job-offers-modal.module';
import {JobOfferDetailsWrapperComponent} from './components/job-offer-details-wrapper/job-offer-details-wrapper.component';
import {OfferedUsersAppliedComponent} from './components/offered-users-applied/offered-users-applied.component';
import {OfferedUsersListComponent} from './components/offered-users-list/offered-users-list.component';
import {OfferedUsersMatchingComponent} from './components/offered-users-matching/offered-users-matching.component';
import {OfferedUsersSentComponent} from './components/offered-users-sent/offered-users-sent.component';
import {OfferedUsersComponent} from './components/offered-users/offered-users.component';
import {JobOfferDetailsRoutingModule} from './job-offer-details-routing.module';
import {JobOffersDetailsService} from './services/job-offer-details/job-offers-details.service';
import {NavigationTabsModule} from '@shared/components/navigation-tabs';
import {JobOfferDetailsCardModule} from '@shared/components/job-offer-details-card';
import {CustomLoaderModule} from '@shared/modules/custom-loader';
import {SharingModule} from '@shared/components/sharing';
import {InfoModalModule} from '@shared/modules/info-modal';
import {ToggleCheckboxModule} from '@controls/toggle-checkbox';
import {ConfirmationDialogModule} from '@shared/modules/confirmation-dialog';
import {SeazoneSelectModule} from '@controls/seazone-select';
import {SEAZ_MODAL_CONFIG} from '@shared/modules/modal';
import {UserNoteService} from '@shared/modules/user-note';
import {PaginatorModule} from '@shared/modules/paginator';
import {SharingOffersModule} from '../sharing-offers/sharing-offers.module';
import {CrewContactsModalForOfferCardModule} from '@shared/components/crew-contacts-modal-for-offer-card/crew-contacts-modal-for-offer-card.module';
import {DisallowCrewAgencyModule} from '@shared/modules/disallow-crew-agency';

@NgModule({
  declarations: [
    JobOfferDetailsWrapperComponent,
    OfferedUsersComponent,
    OfferedUsersMatchingComponent,
    OfferedUsersAppliedComponent,
    OfferedUsersSentComponent,
    OfferedUsersListComponent,
  ],
    imports: [
        CommonModule,
        JobOfferDetailsRoutingModule,
        NavigationTabsModule,
        BoatShortInfoCardModule,
        SeazoneIconsModule,
        NoDataModule,
        CrewJobOfferCardModule,
        TranslocoModule,
        PaginatorModule,
        CustomLoaderModule,
        ConfirmationDialogModule,
        ScrollControlsModule,
        ScrollToActiveLinkModule,
        ReactiveFormsModule,
        JobOfferDetailsCardModule,
        ToggleCheckboxModule,
        InfoModalModule,
        PermissionsModule,
        JobOffersModalModule,
        BoatCrewJobOfferActionsModule,
        UnpublishJobOfferModule,
        SharingModule,
        SeazoneSelectModule,
        SharingOffersModule,
        CrewContactsModalForOfferCardModule,
        DisallowCrewAgencyModule,
    ],
  providers: [
    JobOffersDetailsService,
    JobOffersService,
    JobOffersApiService,
    BoatCrewService,
    {
      provide: UserNoteService,
      useExisting: JobOffersDetailsService,
    },
    {
      provide: SEAZ_MODAL_CONFIG,
      useValue: {
        panelClass: 'seaz-modal',
        backdropClass: 'seaz-background',
      }
    },
  ],
})
export class JobOfferDetailsModule {
  constructor(private readonly seazoneIconsRegistryService: SeazoneIconRegistryService) {
    this.seazoneIconsRegistryService.registerIcons(
      [
        longArrowIcon,
        searchIcon,
        shevronIcon,
        phoneIcon,
        emailIcon,
        skypeIcon,
        linkedinIcon,
      ]);
  }
}
