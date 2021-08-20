import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppRouterService} from '@core/services';
import {ChangeUserFavoriteStatusI, SendCrewJobOfferI} from '@models';
import {GeneralSettingsSearchCrewParamsDto} from '@shared/models/directories/general-settings.model';
import {BoatCrewJobOfferActionsService} from '@shared/modules/boat-crew-job-offer-actions';
import {Observable, of} from 'rxjs';
import {switchMap, take, takeUntil} from 'rxjs/operators';
import {SearchCrewBaseComponent} from '../../classes/search-crew-base.component';
import {JobOffersHistoryModalService} from '../../modules/job-offers-history/services/job-offers-history-modal.service';
import {SearchCrewService} from '../../services/search-crew.service';
import {ConfirmationDialogDataI, ConfirmationDialogService} from '@shared/modules/confirmation-dialog';

@Component({
  selector: 'app-search-crew-not-relevant',
  templateUrl: './search-crew-not-relevant.component.html',
  styleUrls: ['./search-crew-not-relevant.component.scss']
})
export class SearchCrewNotRelevantComponent extends SearchCrewBaseComponent implements OnInit {

  public searchCrewSettings$: Observable<GeneralSettingsSearchCrewParamsDto>;

  constructor(
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly searchCrewService: SearchCrewService,
    protected readonly confirmationDialogService: ConfirmationDialogService,
    protected readonly appRouterService: AppRouterService,
    protected readonly jobOffersHistoryModalService: JobOffersHistoryModalService,
    protected readonly boatCrewJobOfferActionsService: BoatCrewJobOfferActionsService,
  ) {
    super(
      router,
      activatedRoute,
      searchCrewService,
      'notRelevant',
      jobOffersHistoryModalService,
      boatCrewJobOfferActionsService,
    );
  }

  ngOnInit() {
    this.searchCrewSettings$ = this.searchCrewService.searchCrewSettings$;
  }

  public onSendJobOffer(payload: SendCrewJobOfferI): void {
    const {userId, userName} = payload;
    this.boatCrewJobOfferActionsService.onSendJobOffer(userId, userName)
      .pipe(
        take(1),
        takeUntil(this.destroyStream$)
      ).subscribe(res => {
      if (res) {
        this.searchCrewService.updateOfferCount();
        this.searchCrewService.removeItemFromListByUserId(userId);
      }
    });
  }

  public onAddToFavorite(status: ChangeUserFavoriteStatusI): void {
    this.searchCrewService.updateFavoriteStatus(status)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe(() => {
        this.searchCrewService.removeItemFromListByUserId(status.userId);
        this.searchCrewService.updateOfferCount();
      });
  }

  public onRemoveNotRelevantList(): void {
    const config: ConfirmationDialogDataI = {
      applyAction: 'actions.confirm',
      title: 'search.modal.removeNotRelevantList'
    };
    this.confirmationDialogService.openAndConfirm(config)
      .pipe(
        switchMap((data) => {
          if (data) {
            return this.searchCrewService.onRemoveNotRelevantList();
          }
          return of(null);
        }),
        takeUntil(this.destroyStream$)
      ).subscribe((res) => {
        if (res) {
          this.searchCrewService.updateOfferCount();
        }
      });
  }

  public onRemoveNotRelevant(userId: number): void {
    this.boatCrewJobOfferActionsService.onRemoveNotRelevant(userId)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe((res) => {
        if (res) {
          this.searchCrewService.removeItemFromListByUserId(userId);
          this.searchCrewService.updateOfferCount();
        }
      });
  }
}
