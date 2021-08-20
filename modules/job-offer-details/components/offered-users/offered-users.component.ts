import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DestroySubscription} from '@helpers';
import {
  BoatAppliedJobOfferCountDto,
  BoatSentJobOfferCountDto, JobOffersReadyType,
  NavItem,
  OfferedUsersSortItemDto,
  OfferedUsersSortType
} from '@models';
import {Observable} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {JobOffersDetailsService} from '../../services/job-offer-details/job-offers-details.service';
import {OverlayService} from '@shared/modules/modal';
import {SharingOffersModalComponent} from '../../../sharing-offers/components/sharing-offers-modal/sharing-offers-modal.component';
import {translate} from '@ngneat/transloco';
import {log} from 'util';
import {SharingCandidatesSourceType, SharingOffersModalData} from '../../../sharing-offers/models/sharing-offers-group.model';

@Component({
  selector: 'app-offered-users',
  templateUrl: './offered-users.component.html',
  styleUrls: ['./offered-users.component.scss']
})
export class OfferedUsersComponent extends DestroySubscription implements OnInit {

  @Output() goToSearch = new EventEmitter<void>();

  public navItems: NavItem[] = [
    // new NavItem('matching', 'offeredUsers.nav.matching'),
    new NavItem('applied', 'offeredUsers.nav.applied'),
    new NavItem('sent', 'offeredUsers.nav.sent'),
  ];

  public sortList: OfferedUsersSortItemDto<OfferedUsersSortType>[] = [
    {
      id: 1,
      name: 'jobOffer.sort.lastAction'
    },
    {
      id: 2,
      name: 'jobOffer.sort.ratingMinMax'
    },
    {
      id: 3,
      name: 'jobOffer.sort.ratingMaxMin'
    },
  ];
  public navItems$: Observable<NavItem[]>;
  public sortControl = new FormControl(null);
  public sortType: number;
  public offerId: string | null;

  constructor(
    private readonly jobOffersDetailsService: JobOffersDetailsService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly overlayService: OverlayService,
  ) {
    super();
  }

  ngOnInit() {
    this.getNavItems();
    this.changeSortValue();
    this.offerId = this.getOfferId();
  }

  public onGoToSearch(): void {
    this.goToSearch.emit();
  }



  public openSharingOffers(): any {
    const type = SharingCandidatesSourceType.JobOffer;
    const offerId = this.offerId ? +this.offerId : NaN;
    const params = new SharingOffersModalData(
      translate('jobOffer.share'),
      translate('jobOffer.shareSimpleOferText'),
      type,
      offerId,
    );
    return this.overlayService.open(
      SharingOffersModalComponent,
      params,
      {
        panelClass: ['seaz-modal', 'modal-small'],
        backdropClass: ['seaz-background', 'modal-background'],
        hasBackdrop: true,
        disposeOnNavigation: true,
      },
      {
        preventBackdropClick: true,
      }
      );
  }

  private getOfferId(): string | null{
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  private getNavItems(): void {
    this.navItems$ = this.jobOffersDetailsService.offersCount$
      .pipe(
        map((info) => this.navItems
          .map(item => {
            const keys = Object.keys(info);
            const key = keys.find(k => item.url === k);
            if (key) {
              const stats: BoatAppliedJobOfferCountDto | BoatSentJobOfferCountDto = info[key];
              const actionsStats: BoatAppliedJobOfferCountDto | BoatSentJobOfferCountDto = info[`${key}Actions`];
              const updated = this.getRouteWithCount(item, stats.all, actionsStats.all);
              return {...updated};
            }
            return {...item};
          })
        ),
        startWith(this.navItems),
      );
  }

  private getRouteWithCount(item: NavItem, count: number, actionsCount: number): NavItem {
    return {...item, additionalData: ` (${count}) ${actionsCount ? '<span> +' + actionsCount + '</span>' : ''}`};
  }

  public changeSortValue() {
    this.sortControl.valueChanges.pipe(
      takeUntil(this.destroyStream$)
    ).subscribe(id => {
      this.updateQueryParams(id);
    });
  }

  private updateQueryParams(id: number) {
    this.router.navigate(
      [],
      {relativeTo: this.activatedRoute, queryParams: {page: 1, sort: id}, queryParamsHandling: 'merge', state: {blockScroll:  true}});
  }
}
