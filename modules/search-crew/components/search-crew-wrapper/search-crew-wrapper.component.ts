import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppRouterService} from '@core/services';
import {camelCaseToKebab, DestroySubscription} from '@helpers';
import {HeaderNavItem, NavItem} from '@models';
import {combineLatest, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SearchCrewService} from '../../services/search-crew.service';

@Component({
  selector: 'app-search-crew-wrapper',
  templateUrl: './search-crew-wrapper.component.html',
  styleUrls: ['./search-crew-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchCrewWrapperComponent extends DestroySubscription implements OnInit, OnDestroy {

  private navItems: HeaderNavItem[] = [
    new HeaderNavItem('all', 'search.nav.all'),
    new HeaderNavItem('favorite', 'search.nav.favorites', 'like'),
    new HeaderNavItem('not-relevant', 'search.nav.notRelevant'),
  ];
  public navItems$: Observable<NavItem[]>;

  constructor(
    private readonly searchCrewService: SearchCrewService,
    private readonly appRouterService: AppRouterService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    super();
    this.searchCrewService.init();
  }

  ngOnInit() {
    this.getNavItems();
  }

  private getNavItems(): void {
    this.navItems$ = combineLatest([
      this.searchCrewService.offerCount$,
      this.getCurrentUrl(),
    ])
      .pipe(
        map(([info, segments]) => this.navItems
          .map(item => {
            const isActive = segments.some((s) => s === item.url);
            const keys = Object.keys(info);
            const key = keys.find(k => item.url === camelCaseToKebab(k));
            if (key) {
              const updated = this.getRouteWithCount(item, info[key]);
              return {...updated, isActive};
            }
            return {...item, isActive};
          })
        ),
        startWith(this.navItems),
      );
  }

  private getCurrentUrl(): Observable<string[]> {
    return this.appRouterService.navigationEnd$.pipe(
      startWith(null),
      map(() => this.appRouterService.getActivatedChildUrl(this.activatedRoute.snapshot)),
    );
  }

  private getRouteWithCount(item: NavItem, count: number): NavItem {
    return {...item, additionalData: `(${count})`};
  }

  ngOnDestroy(): void {
    this.searchCrewService.destroy();
  }

}
