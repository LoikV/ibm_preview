import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {AppRouterService} from '@core/services';
import {DestroySubscription} from '@helpers';
import {
  ChangeUserFavoriteStatusI,
  ConditionalStatus,
  CrewCvDto,
  CrewCvProfilePayload,
  JobOfferInvitationStatusType
} from '@models';
import {BoatCrewJobOfferActionsService} from '@shared/modules/boat-crew-job-offer-actions';
import {Observable, of} from 'rxjs';
import {catchError, map, shareReplay, switchMap, take, takeUntil} from 'rxjs/operators';
import {SearchCrewProfileService} from '../../services/search-crew-profile.service';

@Component({
  selector: 'app-preview-user-profile',
  templateUrl: './search-crew-profile.component.html',
  styleUrls: ['./search-crew-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchCrewProfileComponent extends DestroySubscription implements OnInit, OnDestroy {

  public profile$: Observable<CrewCvDto | null>;
  public jobOfferInvitationId: string | null;
  public userId: string | null;
  public JobOfferInvitationStatusType = JobOfferInvitationStatusType;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly searchCrewProfileService: SearchCrewProfileService,
    private readonly appRouterService: AppRouterService,
    private readonly boatCrewJobOfferActionsService: BoatCrewJobOfferActionsService,
  ) {
    super();
    this.searchCrewProfileService.init();
  }

  ngOnInit() {
    this.getProfile();
    this.onQueryParamsChanged();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.searchCrewProfileService.destroy();
  }

  private getProfile(): void {
    this.profile$ = this.searchCrewProfileService.profile$
      .pipe(
        catchError((err) => {
          if (err) {
            const boatId = this.searchCrewProfileService.boatId || null;
            if (boatId) {
              this.appRouterService.navigateToSearchCrew(`${boatId}`);
              return of(null);
            }
            this.appRouterService.goBack();
          }
          return of(null);
        }),
        shareReplay(1),
      );
  }

  private onQueryParamsChanged(): void {
    this.activatedRoute.queryParams.pipe(
      takeUntil(this.destroyStream$)
    ).subscribe(params => {
        this.parseCvParams(params);
      }
    );
  }

  private parseCvParams(params: Params): void {
    const jobOfferInvitationId = params && params.jobOfferInvitationId || null;
    const userId = params && params.userId || null;
    this.jobOfferInvitationId = jobOfferInvitationId;
    this.userId = userId;
    const cvParams: CrewCvProfilePayload = {
      jobOfferInvitationId,
      userId
    };
    this.searchCrewProfileService.updateCvParams(cvParams);
  }

  public backClickHandler(): void {
    this.appRouterService.goBack();
  }

  public onSendOffer(): void {
    if (!this.userId) {
      return;
    }
    const userId = parseInt(this.userId, 10);
    this.profile$.pipe(
      switchMap((profile: CrewCvDto) => this.boatCrewJobOfferActionsService.onSendJobOffer(userId, profile.user.fullName)),
      take(1),
      takeUntil(this.destroyStream$)
    ).subscribe(res => {
      if (res) {
        if (!this.jobOfferInvitationId) {
          this.appRouterService.goBack();
          return;
        }
        this.searchCrewProfileService.updateProfile();
      }
    });
  }

  public onSendOfferAgain(canSendOfferAgain: boolean): void {
    if (!this.jobOfferInvitationId) {
      return;
    }
    const jobOfferInvitationId = parseInt(this.jobOfferInvitationId, 10);
    this.boatCrewJobOfferActionsService.onSendAgain({
      canSendOfferAgain,
      jobOfferInvitationId,
    }).pipe(
      takeUntil(this.destroyStream$)
    ).subscribe(res => {
      if (res) {
        this.searchCrewProfileService.updateProfile();
      }
    });
  }

  public onAddNotRelevant(): void {
    if (!this.userId) {
      return;
    }
    const userId = parseInt(this.userId, 10);
    this.boatCrewJobOfferActionsService.onAddNotRelevant(userId)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe(res => {
      if (res) {
        this.appRouterService.goBack();
      }
    });
  }

  public onDecline(notRelevant: ConditionalStatus): void {
    if (!this.jobOfferInvitationId) {
      return;
    }
    const jobOfferInvitationId = parseInt(this.jobOfferInvitationId, 10);
    const data = {
      notRelevant,
      jobOfferInvitationId
    };
    this.boatCrewJobOfferActionsService.declineJobOffer(data)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe((res) => {
      if (res) {
        this.searchCrewProfileService.updateProfile();
      }
    });
  }

  public onRevise(): void {
    if (!this.jobOfferInvitationId) {
      return;
    }
    const jobOfferInvitationId = parseInt(this.jobOfferInvitationId, 10);
    this.boatCrewJobOfferActionsService.onRevise(jobOfferInvitationId)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe((res) => {
      if (res) {
        this.searchCrewProfileService.updateProfile();
      }
    });
  }

  public onAddAsCrew(): void {
    const boatId = this.searchCrewProfileService.boatId;
    const jobOfferInvitationId = !!this.jobOfferInvitationId && parseInt(this.jobOfferInvitationId, 10);
    if (!boatId || !jobOfferInvitationId) {
      return;
    }
    this.boatCrewJobOfferActionsService.onAddCrew(jobOfferInvitationId);
  }

  public onToggleFavoriteStatus(data: ChangeUserFavoriteStatusI): void {
    this.searchCrewProfileService.updateFavoriteStatus(data)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe(res => {
      if (res) {
        this.searchCrewProfileService.updateProfile();
      }
    });
  }
}
