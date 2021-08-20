import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppRouterService} from '@core/services';
import {PublishStatus} from '@models';
import {BoatDetailsService, DirectoriesService} from '@services';
import {NewOffersActionsInfoService} from '@services/job-offers/new-actions-informations/new-offers-actions-info.service';
import {UnpublishJobOfferModalService} from '@shared/components/unpublish-job-offer/services/unpublish-job-offer-modal.service';
import {NotificationService} from '@shared/modules/notification';
import {JobOfferManagerModalService} from '../../../job-offers-modal/services/job-offer-manager-modal.service';
import {JobOffersPage} from '../../models/job-offers-page';
import {JobOffersService} from '../../services/job-offers.service';
import {InfoModalService} from '@shared/modules/info-modal';
import {ConfirmationDialogService} from '@shared/modules/confirmation-dialog';
import {ChangeOfferPublishStatusService} from '../../../../services/change-offer-publish-status.service';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrls: ['./job-offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobOffersComponent extends JobOffersPage implements OnInit {

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
      PublishStatus.Published,
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
