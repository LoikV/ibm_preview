import {Injectable} from '@angular/core';
import {TransferHttpService} from '@gorniv/ngx-transfer-http';
import {httpParamsFromObject} from '@helpers';
import {
  ChangeUserFavoriteStatusI,
  CrewCvDto,
  CrewCvProfileBoatPayload,
  CrewCvProfilePayload,
  ResponseDto
} from '@models';
import {BehaviorSubject, combineLatest, Observable, of, Subject} from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';
import {BoatDetailsService, CrewCvService, CrewSearchService} from '@services';
import {CrewService} from '@services/crew/crew.service';
import {loader} from '@shared/modules/custom-loader/models/decorators';
import {Params} from '@angular/router';

@Injectable()
export class SearchCrewProfileService {


  private cvParams$: BehaviorSubject<CrewCvProfilePayload | null>;
  private updateUserProfile$: Subject<void>;
  public profile$: Observable<CrewCvDto | null>;

  public get boatId() {
    return this.boatDetailsService.boatId;
  }

  constructor(
    private readonly boatDetailsService: BoatDetailsService,
    private readonly crewSearchService: CrewSearchService,
  ) {
  }

  public init(): void {
    this.cvParams$ = new BehaviorSubject(null);
    this.updateUserProfile$ = new Subject();
    this.profile$ = this.getViewProfile();
  }

  public destroy(): void {
    this.cvParams$.complete();
    this.updateUserProfile$.complete();
  }

  public updateCvParams(payload: CrewCvProfilePayload): void {
    if (!this.cvParams$ || this.cvParams$.isStopped) {
      return;
    }
    this.cvParams$.next(payload);
  }

  public updateProfile(): void {
    if (!this.updateUserProfile$ || this.updateUserProfile$.isStopped) {
      return;
    }
    this.updateUserProfile$.next();
  }

  private getViewProfile(): Observable<CrewCvDto | null> {
    return combineLatest([
      this.cvParams$,
      this.updateUserProfile$.pipe(startWith(null)),
    ]).pipe(
      switchMap(([params]) => {
        if (!params) {
          return of(null);
        }

        const boatId = this.boatId;
        const {userId, jobOfferInvitationId} = params;
        const payload = {userId, jobOfferInvitationId, boatId};
        return this.crewSearchService.getCrewCv(payload);
      })
    );
  }

  @loader()
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

}


