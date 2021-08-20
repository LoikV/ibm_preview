import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TranslocoModule} from '@ngneat/transloco';
import {SendJobOfferModule} from '@shared/components/send-job-offer';
import {DownloadUrl} from '@shared/directives/file-downloader';
import {BoatCrewJobOfferActionsModule} from '@shared/modules/boat-crew-job-offer-actions';
import {
  CrewCvDownloadConfig,
  CrewCvModule,
  CREW_CV_DOWNLOAD_CONFIG,
  ShowFullCrewCvConfig,
  VISIBLE_FULL_INFORMATION_PROFILE
} from '@shared/modules/crew-cv';
import {SearchCrewProfileComponent} from './components/search-crew-profile/search-crew-profile.component';
import {SearchCrewProfileRoutingModule} from './search-crew-profile.routing.module';
import {SearchCrewProfileService} from './services/search-crew-profile.service';
import {InfoModalModule} from '@shared/modules/info-modal';
import {SeazoneIconRegistryService, SeazoneIconsModule, shevronIcon} from '@shared/modules/seazone-icons';
import {SEAZ_MODAL_CONFIG} from '@shared/modules/modal';
import {CustomLoaderModule} from '@shared/modules/custom-loader';

const showFullProfileConfig: ShowFullCrewCvConfig = {
  showContacts: true,
  canShared: true,
  canLike: true,
};

const crewCvDownloadConfig: CrewCvDownloadConfig = {
  downloadCourse: DownloadUrl.BoatCrewCourseList,
  downloadDocumentListUrl: DownloadUrl.BoatCrewDocumentList,
  downloadDocumentUrl: DownloadUrl.BoatCrewDocument,
  downloadReference: DownloadUrl.BoatCrewReference,
  downloadContractReference: DownloadUrl.BoatCrewContractReference,
  downloadBankDetails: null,
};

@NgModule({
  declarations: [SearchCrewProfileComponent],
  imports: [
    CommonModule,
    CrewCvModule,
    CustomLoaderModule,
    SearchCrewProfileRoutingModule,
    TranslocoModule,
    SeazoneIconsModule,
    InfoModalModule,
    BoatCrewJobOfferActionsModule,
    SendJobOfferModule,
  ],
  providers: [
    SearchCrewProfileService,
    {
      provide: VISIBLE_FULL_INFORMATION_PROFILE,
      useValue: showFullProfileConfig,
    },
    {
      provide: CREW_CV_DOWNLOAD_CONFIG,
      useValue: crewCvDownloadConfig,
    },
    {
      provide: SEAZ_MODAL_CONFIG,
      useValue: {
        panelClass: 'seaz-modal',
        backdropClass: 'seaz-background',
      }
    },
  ]
})
export class SearchCrewProfileModule {
  constructor(
    private readonly seazoneIconRegistryService: SeazoneIconRegistryService,
  ) {
    this.seazoneIconRegistryService.registerIcons([shevronIcon]);
  }
}
