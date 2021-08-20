import {BreakpointObserver} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, QueryParamsHandling, Router} from '@angular/router';
import {AppRouterService} from '@core/services';
import {cleanObject} from '@helpers';
import {
  ChangeUserFavoriteStatusI,
  CrewSearchAdditionalDirectories,
  CrewSearchAdditionalFilterForm,
  CrewSearchAdditionalParams,
  CrewSearchFilterDirectories,
  CrewSearchFilterForm,
  CrewSearchFilterParams,
  CrewSearchInputFilterForm,
  PublishStatus,
  SearchLocationForm,
} from '@models';
import {CrewSearchFilterModalService} from '@shared/components/search/crew-search-filter';
import {BoatCrewJobOfferActionsService} from '@shared/modules/boat-crew-job-offer-actions';
import {SearchMapModalDataI, SearchMapModalService} from '@shared/modules/search-map';
import {BehaviorSubject, combineLatest, EMPTY, Observable, Subject} from 'rxjs';
import {filter, map, switchMap, take, takeUntil} from 'rxjs/operators';
import {SearchCrewBaseComponent} from '../../classes/search-crew-base.component';
import {JobOffersHistoryModalService} from '../../modules/job-offers-history/services/job-offers-history-modal.service';
import {SearchCrewService} from '../../services/search-crew.service';
import {FilterBadgeItemBase} from '@shared/components/filter-badge/classes/filter-badge-item';
import {
  UpdateBoatLocationModalDataI,
  UpdateBoatLocationModalService
} from '@shared/components/update-boat-location-modal';
import {PermissionsService} from '@shared/modules/permissions';
import {SearchCrewParamsToFormService} from '../../helpers/search-crew-params-to-form';
import {translate} from '@ngneat/transloco';
import {JobOfferManagerModalService} from '../../../job-offers-modal/services/job-offer-manager-modal.service';
import {BoatDetailsService} from '@services';
import {SEAZONE_LOCATION_FORM_CONFIG, SeazoneLocationFormConfig} from '@shared/components/search';
import {InfoModalService} from '@shared/modules/info-modal';
import {LocationLatLngDto} from '@controls/location-autocomplete';
import {BOAT_NAV_EXTRAS_STATE} from '../../../../../../../../static/boat-nav-items';

@Component({
  selector: 'app-search-crew-all',
  templateUrl: './search-crew-all.component.html',
  styleUrls: ['./search-crew-all.component.scss'],
})
export class SearchCrewAllComponent extends SearchCrewBaseComponent implements OnInit, OnDestroy {

  public filterDirectories$: Observable<CrewSearchFilterDirectories>;
  public additionalDirectories$: Observable<CrewSearchAdditionalDirectories>;
  public initialFilterForm: CrewSearchFilterForm;
  public initialAdditionalFilterForm: CrewSearchAdditionalFilterForm;
  public initialInputFilter: CrewSearchInputFilterForm;
  private activeFiltersCount$ = new BehaviorSubject<number>(0);
  public filtersCount$ = this.activeFiltersCount$.asObservable();
  private showMapMediaQuery = `(min-width: 1150px)`;
  public showMap$: Observable<boolean>;
  private filterBadgesList$ = new Subject<FilterBadgeItemBase[]>();
  public filterBadges$: Observable<FilterBadgeItemBase[]> = this.filterBadgesList$.asObservable();
  public isBoatLocationUpdated = false;

  constructor(
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    private readonly crewSearchFilterModalService: CrewSearchFilterModalService,
    protected readonly searchCrewService: SearchCrewService,
    protected readonly appRouterService: AppRouterService,
    private readonly searchMapModalService: SearchMapModalService,
    private readonly breakpointObserver: BreakpointObserver,
    protected readonly jobOffersHistoryModalService: JobOffersHistoryModalService,
    protected readonly boatCrewJobOfferActionsService: BoatCrewJobOfferActionsService,
    private readonly cdr: ChangeDetectorRef,
    private readonly updateBoatLocationModalService: UpdateBoatLocationModalService,
    private readonly permissionsService: PermissionsService,
    @Inject(SEAZONE_LOCATION_FORM_CONFIG) private readonly locationConfig: SeazoneLocationFormConfig,
    private readonly jobOfferManagerModalService: JobOfferManagerModalService,
    private readonly infoModalService: InfoModalService,
    private readonly boatDetailsService: BoatDetailsService,
  ) {
    super(
      router,
      activatedRoute,
      searchCrewService,
      'filter',
      jobOffersHistoryModalService,
      boatCrewJobOfferActionsService,
    );
  }

  ngOnInit() {
    this.filterDirectories$ = this.searchCrewService.filterDirectories$;
    this.additionalDirectories$ = this.searchCrewService.additionalDirectories$;
    this.setInitialFormParams();
    this.onPopStateEvent();
    this.onNavigationEnd();
    this.showMap$ = this.getShowMap();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.activeFiltersCount$.complete();
    this.filterBadgesList$.complete();
  }

  public onChangeFilter(form: CrewSearchFilterForm): void {
    this.updateFilterCount(form);
    const filterParams = new CrewSearchFilterParams(form);
    const page = this.getRouteQueryParamByName('page');
    this.setQueryParam({...filterParams, page: page ? 1 : null}, true);
  }

  public onChangeEmailFilter(email: string): void {
    const handling = email ? '' : 'merge';
    const params = {userId: null, email};
    this.setInputFilter(params, handling);
  }

  public onChangeUserIdFilter(userId: string): void {
    const handling = userId ? '' : 'merge';
    const params = {userId, email: null};
    this.setInputFilter(params, handling);
  }

  private setInputFilter(params: Params, handling: QueryParamsHandling): void {
    this.setQueryParam(params, true, handling);
    if (handling) {
      return;
    }
    this.initialFilterForm = new CrewSearchFilterForm();
    this.updateFilterCount(this.initialFilterForm);
    this.initialAdditionalFilterForm = new CrewSearchAdditionalFilterForm();
  }

  public onChangeAdditionalFilter(form: CrewSearchAdditionalFilterForm): void {
    const params = new CrewSearchAdditionalParams(form);
    const page = this.getRouteQueryParamByName('page');
    this.setQueryParam({...params, page: page ? 1 : null}, true);
  }

  public onOpenSearchFilterModal(): void {
    const params = this.activatedRoute.snapshot.queryParams;
    const initialForm = this.getInitialFilterForm(params);
    combineLatest([
      this.filterDirectories$,
      this.list$,
    ]).pipe(
      switchMap(([directories, list]) => {
        const pagination = (list && list.pagination) || null;
        return this.crewSearchFilterModalService.open({directories, initialForm, pagination});
      }),
      take(1),
      takeUntil(this.destroyStream$)
    ).subscribe(res => {
      if (res) {
        this.onChangeFilter(res);
        this.initialFilterForm = res;
      }
    });
  }

  public onToggleFavoriteStatus(status: ChangeUserFavoriteStatusI): void {
    this.searchCrewService.updateFavoriteStatus(status)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe(() => {
      this.searchCrewService.toggleListItemFavoriteStatus(status);
      this.searchCrewService.updateOfferCount();
    });
  }

  public onAddNotRelevant(userId: number): void {
    this.boatCrewJobOfferActionsService.onAddNotRelevant(userId)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe((res) => {
      if (res) {
        this.searchCrewService.removeItemFromListByUserId(userId);
        this.searchCrewService.updateOfferCount();
      }
    });
  }

  public onFilterBadgesChanges(badges: FilterBadgeItemBase[]): void {
    this.filterBadgesList$.next(badges);
  }

  public onResetFilters(): void {
    this.setQueryParam({}, true, '');
    this.initialFilterForm = new CrewSearchFilterForm();
    this.initialAdditionalFilterForm = new CrewSearchAdditionalFilterForm();
  }

  public onOpenMap(): void {
    this.getMapModalConfig()
      .pipe(
        switchMap(config => this.searchMapModalService.openSearchMapModal(config)),
        take(1),
        takeUntil(this.destroyStream$),
      ).subscribe(res => {
      if (res) {
        const {sort} = this.initialAdditionalFilterForm;
        this.initialAdditionalFilterForm = new CrewSearchAdditionalFilterForm(res, sort);
        this.cdr.detectChanges();
      }
    });
  }


  private getMapModalConfig(): Observable<SearchMapModalDataI> {
    const params = this.activatedRoute.snapshot.queryParams;
    const formParams = this.getInitialAdditionalFilterForm(params);
    return this.additionalDirectories$.pipe(
      map(directories => {
        return {
          location: formParams.location,
          directories: directories.location,
        };
      })
    );
  }

  private updateFilterCount(form: CrewSearchFilterForm): void {
    // TODO: rewrite for exclude offer from form
    const filterParams = {...form, offer: null};
    const cleaned = cleanObject(filterParams);
    const count = Object.keys(cleaned).length;
    this.activeFiltersCount$.next(count);
  }

  private setInitialFormParams(): void {
    const params = this.activatedRoute.snapshot.queryParams;
    const initialFilterForm = this.getInitialFilterForm(params);
    this.initialFilterForm = initialFilterForm;
    this.updateFilterCount(initialFilterForm);
    this.initialAdditionalFilterForm = this.getInitialAdditionalFilterForm(params);
    this.initialInputFilter = this.getInitialForAdditionalFilter(params);
  }

  private getInitialFilterForm(params: Params): CrewSearchFilterForm {
    return SearchCrewParamsToFormService.mapParamsToFilterForm(params);
  }

  private getInitialAdditionalFilterForm(params: Params): CrewSearchAdditionalFilterForm {
    return SearchCrewParamsToFormService.mapParamsToAdditionalFilterForm(params);
  }

  private getInitialForAdditionalFilter(params: Params): CrewSearchInputFilterForm {
    return SearchCrewParamsToFormService.mapParamsToCrewSearchInputFilterForm(params);
  }

  private onPopStateEvent(): void {
    this.appRouterService.navigationStart$
      .pipe(
        filter(e => e.navigationTrigger === 'popstate'),
        switchMap(() => this.appRouterService.navigationEnd$.pipe(take(1))),
        takeUntil(this.destroyStream$),
      ).subscribe(() => this.setInitialFormParams());
  }

  private getShowMap(): Observable<boolean> {
    return this.breakpointObserver.observe(this.showMapMediaQuery)
      .pipe(
        map(state => state.matches),
      );
  }

  private onNavigationEnd(): void {
    const boatHeaderState = BOAT_NAV_EXTRAS_STATE;
    this.appRouterService.navigationEndExtras$.pipe(
      takeUntil(this.destroyStream$)
    ).subscribe((extras => {
      const state = extras && extras.state;
      if (state && JSON.stringify(state) === JSON.stringify(boatHeaderState)) {
        this.setInitialFormParams();
      }
    }));
  }

  public onNearBoatSelected(data: UpdateBoatLocationModalDataI): void {
    if (this.isBoatLocationUpdated) {
      return;
    }

    const boatId = this.searchCrewService.boatId;
    if (!boatId) {
      return;
    }

    const hasBoatPermission = this.permissionsService.checkPermissions(boatId, 'perm_fin_edit_boat_profile');
    if (!hasBoatPermission) {
      return;
    }

    this.searchCrewService.canUserChangeBoatLocation()
      .pipe(
        map(res => res.canChange),
        switchMap(canChange => {
          if (canChange) {
            return this.updateBoatLocationModalService.open(data);
          }
          this.isBoatLocationUpdated = true;
          return EMPTY;
        }),
        take(1),
        takeUntil(this.destroyStream$)
      ).subscribe(position => {
      this.isBoatLocationUpdated = true;
      if (position) {
        this.patchBoatPosition(position);
      }
    });
  }

  private patchBoatPosition(position: LocationLatLngDto): void {
    this.searchCrewService.updateCommonInfo();
    const queryParams = this.activatedRoute.snapshot.queryParamMap;
    const page = queryParams.get('page');
    const initialAdditionalFilterForm = this.getInitialAdditionalFilterForm(queryParams);
    const {sort} = initialAdditionalFilterForm;
    const max = this.locationConfig.nearDistance;
    const form: SearchLocationForm = {
      distance: {min: 0, max},
      position,
      nearMe: false,
      nearBoat: true,
    };
    this.initialAdditionalFilterForm = {sort, location: form};
    const params = new CrewSearchAdditionalParams(this.initialAdditionalFilterForm);
    this.setQueryParam(
      {...params, page: page ? 1 : null},
      true,
      'merge'
    );
  }

  public addJobOffer(): void {
    this.jobOfferManagerModalService.openModal()
      .pipe(
        takeUntil(this.destroyStream$))
      .subscribe((data) => {
        if (!data) {
          return;
        }
        const {status} = data;
        if (status === null) {
          return;
        }
        const boatId = this.boatDetailsService.boatId;
        if (!boatId) {
          return;
        }
        const isPublish = status === PublishStatus.Published;
        if (isPublish) {
          const successCreateMsg = translate('jobOffer.modal.createPublishMsg');
          this.appRouterService.navigateToPublishOffers(boatId.toString());
          this.infoModalService.openSeazThemeModal(successCreateMsg);
          return;
        }
        const successCreateUnpublishMsg = translate('jobOffer.modal.createUnPublishMsg');
        this.appRouterService.navigateToUnpublishOffers(boatId.toString());
        this.infoModalService.openSeazThemeModal(successCreateUnpublishMsg);
      });
  }

}
