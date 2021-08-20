import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppRouterService} from '@core/services';
import {JobOfferNavItem, JobOfferStatusType} from '@models';
import {CrewSearchListDto} from '@models/crew-search/crew-search-list.model';
import {BoatDetailsService} from '@services';
import {StubImages} from '@shared/directives/image-stub/image-stub.directive';
import {BoatCrewJobOfferActionsService} from '@shared/modules/boat-crew-job-offer-actions';
import {Observable} from 'rxjs';
import {JobOffersReadyBaseComponent} from '../../models/job-offers-ready-page';
import {JobOffersDetailsService} from '../../services/job-offer-details/job-offers-details.service';
import {OverlayService} from '@shared/modules/modal';

const translatePrefix = 'jobSearch.statuses';

@Component({
  selector: 'app-offered-users-sent',
  templateUrl: './offered-users-sent.component.html',
  styleUrls: ['./offered-users-sent.component.scss']
})
export class OfferedUsersSentComponent extends JobOffersReadyBaseComponent implements OnInit {

  public navItems = [
    new JobOfferNavItem(null, `${translatePrefix}.allActive`, 'allActive'),
    new JobOfferNavItem(JobOfferStatusType.STATUS_PENDING, `${translatePrefix}.pending`, 'pending'),
    new JobOfferNavItem(JobOfferStatusType.STATUS_IN_PROCESS, `${translatePrefix}.inProcess`, 'inProcess'),
    new JobOfferNavItem(JobOfferStatusType.STATUS_DECLINE, `${translatePrefix}.declined`, 'declined'),
    new JobOfferNavItem(JobOfferStatusType.STATUS_HIRED, `${translatePrefix}.crewHired`, 'jobOfferHired'),
  ];

  public users$: Observable<CrewSearchListDto>;
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
      'sent',
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

}
