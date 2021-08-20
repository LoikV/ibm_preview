import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppRouterService} from '@core/services';
import {JobOfferNavItem, JobOfferStatusType} from '@models';
import {BoatDetailsService} from '@services';
import {StubImages} from '@shared/directives/image-stub/image-stub.directive';
import {BoatCrewJobOfferActionsService} from '@shared/modules/boat-crew-job-offer-actions';
import {JobOffersReadyBaseComponent} from '../../models/job-offers-ready-page';
import {JobOffersDetailsService} from '../../services/job-offer-details/job-offers-details.service';
import {OverlayService} from '@shared/modules/modal';

const translatePrefix = 'jobSearch.statuses';

@Component({
  selector: 'app-offered-users-applied',
  templateUrl: './offered-users-applied.component.html',
  styleUrls: ['./offered-users-applied.component.scss']
})
export class OfferedUsersAppliedComponent extends JobOffersReadyBaseComponent
  implements OnInit {

  public navItems: JobOfferNavItem[] = [
    new JobOfferNavItem(
      null,
      `${translatePrefix}.allActive`,
      'allActive'
    ),
    new JobOfferNavItem(
      JobOfferStatusType.STATUS_NEW,
      `${translatePrefix}.new`,
      'newOffer'
    ),
    new JobOfferNavItem(
      JobOfferStatusType.STATUS_IN_PROCESS,
      `${translatePrefix}.inProcess`,
      'inProcess'
    ),
    new JobOfferNavItem(
      JobOfferStatusType.STATUS_DECLINE,
      `${translatePrefix}.declined`,
      'declined'
    ),
    new JobOfferNavItem(
      JobOfferStatusType.STATUS_HIRED,
      `${translatePrefix}.crewHired`,
      'jobOfferHired'
    )
  ];

  public stubImages = StubImages;

  constructor(
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly boatDetailsService: BoatDetailsService,
    protected readonly jobOffersDetailsService: JobOffersDetailsService,
    protected readonly appRouterService: AppRouterService,
    protected readonly overlayService: OverlayService,
    protected readonly boatCrewJobOfferActionsService: BoatCrewJobOfferActionsService,
  ) {
    super(
      'applied',
      router,
      activatedRoute,
      boatDetailsService,
      jobOffersDetailsService,
      appRouterService,
      overlayService,
      boatCrewJobOfferActionsService,
    );
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public onRemoveAppliedList(): void {
  }

}
