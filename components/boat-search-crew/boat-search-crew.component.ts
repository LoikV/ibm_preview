import {Component, OnDestroy, OnInit} from '@angular/core';
import {FeatureToggleService} from '@core/modules/feature-toggle';
import {BoatShortInfoDto, JobOffersNewActionsI, NavItem} from '@models';
import {BoatDetailsService} from '@services';
import {NewOffersActionsInfoService} from '@services/job-offers/new-actions-informations/new-offers-actions-info.service';
import {UserPermissions} from '@shared/modules/permissions';
import {combineLatest, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {BoatSearchCrewService} from '../../services/boat-search-crew.service';

@Component({
  selector: 'app-boat-search-crew',
  templateUrl: './boat-search-crew.component.html',
  styleUrls: ['./boat-search-crew.component.scss'],
})
export class BoatSearchCrewComponent implements OnInit, OnDestroy {

  public boatShortInfo$: Observable<BoatShortInfoDto>;
  public navItems$: Observable<NavItem[]>;
  public newActions$: Observable<JobOffersNewActionsI>;

  private navItems: NavItem[] = [
    new NavItem('crew', 'search.nav.crew', '', '', ['perm_search_crew_search'], '', '_blank', [], 'search-crew'),
    new NavItem('offers', 'search.nav.offers', '', '', ['perm_search_job_offer_view'], '', '_blank', [], 'feature-offers'),
  ];

  constructor(
    private readonly boatSearchCrewService: BoatSearchCrewService,
    private readonly featureToggleService: FeatureToggleService,
    private readonly boatDetailsService: BoatDetailsService,
    private readonly newOffersActionsInfoService: NewOffersActionsInfoService,
  ) {
    this.newOffersActionsInfoService.init();
  }

  ngOnInit() {
    this.boatShortInfo$ = this.boatSearchCrewService.boatShortInfo$;
    this.getNavItems();
    this.newActions$ = this.newOffersActionsInfoService.countActions$;
  }

  ngOnDestroy() {
    this.newOffersActionsInfoService.destroy();
  }

  private getNavItems(): void {
    this.navItems$ = combineLatest([
      this.boatDetailsService.permissions$,
      this.featureToggleService.featuresList$,
    ]).pipe(
      map(([permissions]) => this.navItems.map(item => {
        const isEnabled = item.featureToggle ? this.featureToggleService.isFeatureEnabled(item.featureToggle) : true;
        if (!isEnabled) {
          return {...item, url: ''};
        }
        const url = this.getNavItemUrlByPermissions(item, permissions);
        return {...item, url};
      })),
      startWith(this.navItems)
    );
  }

  private getNavItemUrlByPermissions(item: NavItem, permissions: UserPermissions[]): string | null {
    const url = item.url;
    const navPermissions = item.permission;
    if (!navPermissions) {
      return url;
    }
    if (Array.isArray(navPermissions)) {
      const havePermission = navPermissions.some(permission => permissions.includes(permission));
      if (!havePermission) {
        return '';
      }
      return url;
    }
    const permitted = permissions.find(permission => permission === item.permission);
    if (!permitted) {
      return '';
    }
    return url;
  }


}
