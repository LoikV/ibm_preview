import {Inject, Injectable} from '@angular/core';
import {Params} from '@angular/router';
import {distinctUntilKeysChanged, getLocationFromParams} from '@helpers';
import {
  BoatJobOfferCountDto,
  CanUserChangeBoatLocationDto,
  ChangeUserFavoriteStatusI, ContractTypeDto,
  CrewSearchAdditionalDirectories,
  CrewSearchCommonInfoDto,
  CrewSearchFilterDirectories,
  CrewSearchListDto, CrewSearchStatusItem,
  CrewSearchType, CvAvailableStatusDto,
  GeneralSettingsSearchCrewParamsDto, LanguageDto, LanguageLevelDto,
  PaginationDto,
  ResponseDto, RolePositionTypeDto,
  SearchLocationDirectories,
} from '@models';
import {BoatDetailsService, BoatService, CrewSearchService, DirectoriesService, JobSearchService} from '@services';
import {JobOffersReadyApiService} from '@services/job-offers/job-offers-ready-list/job-offers-ready-api.service';
import {CrewSearchMapItemDto, CrewSearchMapParamsPayload, CrewSearchParamsPayload} from '@shared/models/crew-search';
import {loader} from '@shared/modules/custom-loader/models/decorators';
import {
  CREW_SEARCH_MARKER_ICON_STUB,
  CrewSearchInfoWindow,
  SearchMapMarkerItem,
  SearchMapServiceI
} from '@shared/modules/search-map';
import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import {SEAZONE_LOCATION_FORM_CONFIG, SeazoneLocationFormConfig} from '@shared/components/search';
import {UserNoteFormI, UserNoteServiceI} from '@shared/modules/user-note';
import {LocationLatLngDto} from '@controls/location-autocomplete';
import {CheckboxGroupItem} from '@controls/seazone-checkbox-group';

@Injectable()
export class SearchCrewService implements SearchMapServiceI, UserNoteServiceI {

  private emptyList = new CrewSearchListDto([], new PaginationDto(0, 0, 0));
  public searchLimit = 8;
  public filterDirectories$: Observable<CrewSearchFilterDirectories>;
  public additionalDirectories$: Observable<CrewSearchAdditionalDirectories>;
  private updateOfferCount$: Subject<void>;
  private updateCrewList$: Subject<void>;
  private crewSearchType$: BehaviorSubject<CrewSearchType | null>;
  private routeParams$: BehaviorSubject<Params | null>;
  private searchList$: BehaviorSubject<CrewSearchListDto | null>;
  private destroyStream$: Subject<void>;
  public list$: Observable<CrewSearchListDto | null>;
  private updateCommonInfo$: Subject<void>;
  public commonInfo$: Observable<CrewSearchCommonInfoDto>;
  public offerCount$: Observable<BoatJobOfferCountDto>;
  public searchParams$: Observable<CrewSearchParamsPayload>;
  public searchCrewSettings$: Observable<GeneralSettingsSearchCrewParamsDto>;
  public mapStartPosition$: Observable<google.maps.LatLngLiteral | null>;
  public updateMapParams$: Observable<Params>;
  public stubImageIcon = CREW_SEARCH_MARKER_ICON_STUB;

  public get boatId(): number | null {
    return this.boatDetailsService.boatId;
  }

  constructor(
    private readonly directoriesService: DirectoriesService,
    private readonly crewSearchService: CrewSearchService,
    private readonly boatDetailsService: BoatDetailsService,
    private readonly jobOffersReadyApiService: JobOffersReadyApiService,
    private readonly jobSearchService: JobSearchService,
    private readonly boatService: BoatService,
    @Inject(SEAZONE_LOCATION_FORM_CONFIG) private readonly locationConfig: SeazoneLocationFormConfig,
  ) {
  }

  public init(): void {
    this.crewSearchType$ = new BehaviorSubject(null);
    this.updateOfferCount$ = new Subject();
    this.updateCrewList$ = new Subject();
    this.updateCommonInfo$ = new Subject();
    this.routeParams$ = new BehaviorSubject(null);
    this.searchList$ = new BehaviorSubject(null);
    this.destroyStream$ = new Subject();
    this.commonInfo$ = this.getCommonInfo();
    this.offerCount$ = this.getOfferCount();
    this.searchCrewSettings$ = this.getSearchCrewSettings();
    this.searchParams$ = this.getSearchParams();
    this.list$ = this.searchList$.asObservable().pipe(shareReplay(1));
    this.filterDirectories$ = this.getFilterDirectories();
    this.additionalDirectories$ = this.getAdditionalFilterDirectories();
    this.mapStartPosition$ = this.getMapStartPosition();
    this.updateMapParams$ = this.getUpdateMapParams();
    this.getSearchList();
  }

  public destroy(): void {
    this.destroyStream$.next();
    this.destroyStream$.complete();
    this.updateOfferCount$.complete();
    this.crewSearchType$.complete();
    this.routeParams$.complete();
    this.searchList$.complete();
    this.updateCrewList$.complete();
  }

  private getSearchParams(): Observable<CrewSearchParamsPayload> {
    return combineLatest([
      this.routeParams$.asObservable().pipe(filter(params => !!params)),
      this.boatDetailsService.boatId$,
      // this.commonInfo$.pipe(take(1)),
      this.updateCrewList$.pipe(startWith(null)),
    ]).pipe(
      map(([params, boatId]: [Params, number, void]) => {
        const searchParams: Params = {
          page: 1,
          limit: this.searchLimit,
          ...params,
          boatId
        };
        // const {myLocationLat, myLocationLng} = params;
        // if (!myLocationLat && !myLocationLng) {
        //   const location = (commonInfo.user && commonInfo.user.location) || null;
        //   if (location) {
        //     const {lat, lng} = location;
        //     searchParams = {...searchParams, myLocationLat: lat, myLocationLng: lng};
        //   }
        // }
        return new CrewSearchParamsPayload(searchParams, this.locationConfig.maxDistance);
      }),
      distinctUntilChanged(),
      shareReplay(1),
    );
  }

  private getMapStartPosition(): Observable<LocationLatLngDto | null> {
    return combineLatest([
      this.searchParams$.pipe(
        map(params => getLocationFromParams(params)),
      ),
      this.commonInfo$
    ]).pipe(
      map(([params, commonInfo]) => {
        if (params) {
          return params;
        }
        const {user, boat} = commonInfo;
        if (boat && boat.location) {
          const {lat, lng} = boat.location;
          return {lat, lng};
        }
        if (user && user.location) {
          const {lat, lng} = user.location;
          return {lat, lng};
        }
        return null;
      }),
      distinctUntilChanged(distinctUntilKeysChanged),
    );
  }

  private getSearchList(): void {
    this.searchParams$.pipe(
      tap(() => this.searchList$.next(null)),
      switchMap((params) => {
        const type = this.crewSearchType$.value;
        if (!type) {
          throw new Error('Search type not set');
        }
        return this.crewSearchService.getCrewSearchList(params, type)
          .pipe(
            catchError(_ => {
              return of(this.emptyList);
            }),
          );
      }),
      takeUntil(this.destroyStream$),
    ).subscribe(
      res => {
        this.searchList$.next(res);
      });
  }

  public getSearchMapList(params: Params): Observable<SearchMapMarkerItem[]> {
    const payload = new CrewSearchMapParamsPayload(params, this.locationConfig.maxDistance);
    return this.boatDetailsService.boatId$.pipe(
      switchMap((boatId) => this.crewSearchService.getCrewSearchMap(payload)
        .pipe(
          map(items => {
            const mapped = items.reduce((acc: SearchMapMarkerItem[], arr) => {
              const length = arr.length;
              if (length > 1) {
                const markers = this.getMapMultiMarkers(arr, boatId);
                acc.push(...markers);
                return acc;
              }
              const marker = this.getMapMarkerItem(arr[0], boatId);
              acc.push(marker);
              return acc;
            }, []);
            return mapped;
          })
        )
      ),
      catchError(_ => {
        return of([]);
      }),
    );
  }

  public updateOfferCount(): void {
    this.updateOfferCount$.next();
  }

  public updateCrewList(): void {
    this.updateCrewList$.next();
  }

  private getMapMarkerItem(item: CrewSearchMapItemDto, boatId: number): SearchMapMarkerItem {
    const {location, id, avatar} = item;
    const infoWindow = new CrewSearchInfoWindow(item, boatId).getInfoWindowContent();
    const marker = new SearchMapMarkerItem(infoWindow, location, id, true, avatar);
    return marker;
  }

  private getMapMultiMarkers(items: CrewSearchMapItemDto[], boatId: number): SearchMapMarkerItem[] {
    const markers = items.map((item, index) => {
      const isLastMarker = index === items.length - 1;
      const modalContent = isLastMarker ?
        items.reduce((info, profile) => info.concat(new CrewSearchInfoWindow(profile, boatId).getInfoWindowContent()), '')
        : '';
      return new SearchMapMarkerItem(modalContent, item.location, null, !!isLastMarker, null, isLastMarker ? items.length : null);
    });
    return markers;
  }

  public setSearchType(type: CrewSearchType): void {
    this.crewSearchType$.next(type);
  }

  public onChangeQueryParams(params: Params): void {
    this.routeParams$.next(params);
  }

  @loader()
  public onRemoveFavoritesList(): Observable<ResponseDto> {
    return this.boatDetailsService.boatId$.pipe(
      switchMap(boatId => this.crewSearchService.removeFavoritesList(boatId)),
      tap(() => this.searchList$.next(this.emptyList))
    );
  }

  public updateFavoriteStatus(currentStatus: ChangeUserFavoriteStatusI): Observable<ResponseDto> {
    const {isFavorite, userId} = currentStatus;
    return this.boatDetailsService.boatId$
      .pipe(
        switchMap(boatId => {
          if (isFavorite) {
            return this.crewSearchService.removeFavorite({boatId, userId});
          }
          return this.crewSearchService.addFavorite({boatId, userId});
        })
      );
  }

  @loader()
  public markAsNotRelevant(userId: number): Observable<ResponseDto> {
    return this.boatDetailsService.boatId$
      .pipe(
        switchMap(boatId => {
          return this.crewSearchService.addNotRelevant({boatId, userId});
        }),
      );
  }

  @loader()
  public markAsRelevant(userId: number): Observable<ResponseDto> {
    return this.boatDetailsService.boatId$
      .pipe(
        switchMap(boatId => {
          return this.crewSearchService.removeNotRelevant({boatId, userId});
        }),
        tap(() => this.removeItemFromListByUserId(userId)),
      );
  }

  @loader()
  public onRemoveNotRelevantList(): Observable<ResponseDto> {
    return this.boatDetailsService.boatId$.pipe(
      switchMap(boatId => this.crewSearchService.removeNotRelevantList(boatId)),
      tap(() => this.searchList$.next(this.emptyList))
    );
  }

  public toggleListItemFavoriteStatus(status: ChangeUserFavoriteStatusI): void {
    const value = this.searchList$.value;
    if (!value) {
      return;
    }
    const {list, pagination} = value;
    const index = list.findIndex(item => item.user.id === status.userId);
    if (index < 0) {
      return;
    }
    const searchItem = list[index];
    list.splice(index, 1, {...searchItem, additional: {...searchItem.additional, favorite: !status.isFavorite}});
    this.searchList$.next({
      list,
      pagination
    });
  }

  public removeItemFromListByUserId(userId): void {
    const value = this.searchList$.value;
    if (!value) {
      return;
    }
    const {list, pagination} = value;
    const index = list.findIndex(item => item.user.id === userId);
    if (index < 0) {
      return;
    }
    list.splice(index, 1);
    const newPagination = this.getNewPaginationAfterRemove(pagination);
    this.searchList$.next({
      list,
      pagination: newPagination
    });
  }

  @loader()
  public updateNote(form: UserNoteFormI): Observable<ResponseDto> {
    return this.boatDetailsService.boatId$
      .pipe(
        switchMap(boatId => {
          const {id, note} = form;
          return this.crewSearchService.updateCrewNote({boatId, note, userId: id});
        }),
        tap(() => this.updateNoteInListByUserId(form))
      );
  }

  private updateNoteInListByUserId(form: UserNoteFormI): void {
    const value = this.searchList$.value;
    if (!value) {
      return;
    }
    const {list, pagination} = value;
    const index = list.findIndex(item => item.user.id === form.id);
    if (index < 0) {
      return;
    }
    const searchItem = list[index];
    list.splice(index, 1, {...searchItem, additional: {...searchItem.additional, note: form.note}});
    this.searchList$.next({
      list,
      pagination
    });
  }

  public updateHasHistoryInListByUserId(userId: number): void {
    const value = this.searchList$.value;
    if (!value) {
      return;
    }
    const {list, pagination} = value;
    const index = list.findIndex(item => item.user.id === userId);
    if (index < 0) {
      return;
    }
    const searchItem = list[index];
    list.splice(index, 1, {...searchItem, additional: {...searchItem.additional, hasHistory: true}});
    this.searchList$.next({
      list,
      pagination
    });
  }

  private getNewPaginationAfterRemove(pagination: PaginationDto): PaginationDto {
    const {currentPage, pageCount, totalCount, commonCount} = pagination;
    const isOneElementOnLastPage = totalCount % this.searchLimit === 1;

    if (isOneElementOnLastPage) {
      const newPageCount = pageCount - 1;
      const newCommonCount = commonCount ? commonCount - 1 : 0;
      return new PaginationDto(
        totalCount - 1,
        newPageCount,
        currentPage > newPageCount ? newPageCount : currentPage,
        newCommonCount
      );
    }
    return new PaginationDto(
      totalCount - 1,
      pageCount,
      currentPage,
      commonCount ? commonCount - 1 : 0
    );
  }

  public updateCommonInfo(): void {
    this.updateCommonInfo$.next();
  }

  private getCommonInfo(): Observable<CrewSearchCommonInfoDto> {
    return combineLatest([
      this.boatDetailsService.boatId$,
      this.updateCommonInfo$.pipe(startWith(null)),
    ]).pipe(
      switchMap(([boatId]) =>
        this.crewSearchService.getCrewSearchCommonInfo({boatId})
          .pipe(
            catchError(() => of(new CrewSearchCommonInfoDto([], [], null, null))),
          )
      ),
      shareReplay(1),
    );
  }

  private getOfferCount(): Observable<BoatJobOfferCountDto> {
    return combineLatest([
      this.boatDetailsService.boatId$,
      this.updateOfferCount$.pipe(startWith(null)),
    ]).pipe(
      switchMap(([boatId]) =>
        this.jobOffersReadyApiService.getOffersCount({boatId})
          .pipe(
            shareReplay(1),
          )
      ),
    );
  }

  private getFilterDirectories(): Observable<CrewSearchFilterDirectories> {
    return combineLatest([
      this.directoriesService.positionTypes$,
      this.directoriesService.cvAvailableStatus$,
      this.directoriesService.contractTypes$,
      this.commonInfo$,
      this.directoriesService.language$,
      this.directoriesService.languageLevel$,
      this.directoriesService.filterCrewSearchStatus$,
    ]).pipe(
      map(([
             positionTypes, availableStatuses, contractTypes, commonInfo, language, level, crewSearchStatuses
           ]: [
        RolePositionTypeDto[],
        CvAvailableStatusDto[],
        ContractTypeDto[],
        CrewSearchCommonInfoDto,
        LanguageDto[],
        LanguageLevelDto[],
        CrewSearchStatusItem[],
      ]) => {
        const statuses = availableStatuses.map(st => new CheckboxGroupItem(st.id, st.name));
        const contracts = contractTypes.map(c => new CheckboxGroupItem(c.id, c.name));
        const allPosition = positionTypes
          .reduce((acc, val) => [...acc, ...val.positions], []);
        const skills = positionTypes.map(pt =>
          new CheckboxGroupItem(
            pt.id,
            pt.name,
            false,
            false,
            pt.skills.map(sk => new CheckboxGroupItem(sk.id, sk.name))
          )
        );
        const {expectedSalary, offers} = commonInfo;

        return new CrewSearchFilterDirectories(
          positionTypes,
          statuses,
          skills,
          contracts,
          expectedSalary,
          language,
          level,
          crewSearchStatuses,
          allPosition,
          offers,
        );
      }),
      shareReplay(1),
    );
  }

  private getAdditionalFilterDirectories(): Observable<CrewSearchAdditionalDirectories> {
    return combineLatest([
      this.directoriesService.crewSearchSort$,
      this.commonInfo$,
    ]).pipe(
      map(([
             searchSort,
             commonInfo,
           ]) => {
        const {boat, user} = commonInfo;
        const userLocation = (user && user.location) || null;
        const boatLocation = (boat && boat.location) || null;
        const location = new SearchLocationDirectories(
          userLocation,
          boatLocation,
        );
        return new CrewSearchAdditionalDirectories(searchSort, location);
      }),
      shareReplay(1),
    );
  }

  private getSearchCrewSettings(): Observable<GeneralSettingsSearchCrewParamsDto> {
    return this.directoriesService.generalSettings$
      .pipe(map(settings => settings.searchCrewParams));
  }

  private getUpdateMapParams(): Observable<CrewSearchParamsPayload> {
    return this.searchParams$.pipe(
      distinctUntilChanged((prev, curr) => distinctUntilKeysChanged(prev, curr)),
    );
  }

  @loader()
  public canUserChangeBoatLocation(): Observable<CanUserChangeBoatLocationDto> {
    return this.boatDetailsService.boatId$.pipe(
      switchMap(boatId => this.boatService.canUserChangeBoatLocation(boatId))
    );
  }

}
