import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppRouterService} from '@core/services';
import {PublishStatus} from '@models';
import {BoatDetailsService, DirectoriesService} from '@services';
import {NewOffersActionsInfoService} from '@services/job-offers/new-actions-informations/new-offers-actions-info.service';
import {UnpublishJobOfferModalService} from '@shared/components/unpublish-job-offer/services/unpublish-job-offer-modal.service';
import {JobOfferManagerModalService} from '../../../job-offers-modal/services/job-offer-manager-modal.service';
import {JobOffersPage} from '../../models/job-offers-page';
import {JobOffersService} from '../../services/job-offers.service';
import {InfoModalService} from '@shared/modules/info-modal';
import {NotificationService} from '@shared/modules/notification';
import {ConfirmationDialogService} from '@shared/modules/confirmation-dialog';
import {AppStateService} from '@core/modules';
import {ChangeOfferPublishStatusService} from '../../../../services/change-offer-publish-status.service';

@Component({
  selector: 'app-unpublished-job-offers',
  templateUrl: './unpublished-job-offers.component.html',
  styleUrls: ['./unpublished-job-offers.component.scss']
})
export class UnpublishedJobOffersComponent extends JobOffersPage implements OnInit, OnDestroy {

  constructor(
    protected readonly confirmationDialogService: ConfirmationDialogService,
    protected readonly jobOffersService: JobOffersService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly boatDetailsService: BoatDetailsService,
    protected readonly appRouterService: AppRouterService,
    protected readonly router: Router,
    protected readonly jobOfferManagerModalService: JobOfferManagerModalService,
    protected readonly notificationService: NotificationService,
    protected readonly infoModalService: InfoModalService,
    protected readonly changeOfferPublishStatusService: ChangeOfferPublishStatusService,
    protected readonly directoriesService: DirectoriesService,
    protected readonly newOffersActionsInfoService: NewOffersActionsInfoService,
  ) {
    super(
      router,
      activatedRoute,
      appRouterService,
      jobOffersService,
      boatDetailsService,
      PublishStatus.UnPublished,
      confirmationDialogService,
      jobOfferManagerModalService,
      notificationService,
      infoModalService,
      changeOfferPublishStatusService,
      directoriesService,
      newOffersActionsInfoService,
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.getOffers();
  }
}
