import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppRouterService} from '@core/services';
import {ChangeUserFavoriteStatusI, GeneralSettingsSearchCrewParamsDto} from '@models';
import {BoatCrewJobOfferActionsService} from '@shared/modules/boat-crew-job-offer-actions';
import {Observable, of} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {SearchCrewBaseComponent} from '../../classes/search-crew-base.component';
import {JobOffersHistoryModalService} from '../../modules/job-offers-history/services/job-offers-history-modal.service';
import {SearchCrewService} from '../../services/search-crew.service';
import {ConfirmationDialogDataI, ConfirmationDialogService} from '@shared/modules/confirmation-dialog';

import {translate} from '@ngneat/transloco';

import {OverlayService} from '@shared/modules/modal';
import {BoatDetailsService} from '@services';
import {SharingCandidatesSourceType, SharingOffersModalData} from '../../../sharing-offers/models/sharing-offers-group.model';
import {SharingOffersModalComponent} from '../../../sharing-offers/components/sharing-offers-modal/sharing-offers-modal.component';

@Component({
  selector: 'app-search-crew-favorites',
  templateUrl: './search-crew-favorites.component.html',
  styleUrls: ['./search-crew-favorites.component.scss']
})
export class SearchCrewFavoritesComponent extends SearchCrewBaseComponent implements OnInit {

  public searchCrewSettings$: Observable<GeneralSettingsSearchCrewParamsDto>;

  constructor(
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly searchCrewService: SearchCrewService,
    private readonly confirmationDialogService: ConfirmationDialogService,
    protected readonly appRouterService: AppRouterService,
    protected readonly jobOffersHistoryModalService: JobOffersHistoryModalService,
    protected readonly boatCrewJobOfferActionsService: BoatCrewJobOfferActionsService,
    private readonly overlayService: OverlayService,
    private readonly boatDetailsService: BoatDetailsService
    ) {
    super(
      router,
      activatedRoute,
      searchCrewService,
      'favorite',
      jobOffersHistoryModalService,
      boatCrewJobOfferActionsService,
    );
  }

  ngOnInit() {
    this.searchCrewSettings$ = this.searchCrewService.searchCrewSettings$;
  }

  public onRemoveFavorites(): void {
    const config: ConfirmationDialogDataI = {
      applyAction: 'actions.confirm',
      title: 'search.modal.removeFavoriteList'
    };
    this.confirmationDialogService.openAndConfirm(config)
      .pipe(
        switchMap((data) => {
          if (data) {
            return this.searchCrewService.onRemoveFavoritesList();
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

  public onRemoveFromFavorite(status: ChangeUserFavoriteStatusI): void {
    this.searchCrewService.updateFavoriteStatus(status)
      .pipe(
        takeUntil(this.destroyStream$)
      ).subscribe(() => {
        this.searchCrewService.removeItemFromListByUserId(status.userId);
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

  public openSharingOffers(): any {
    const type = SharingCandidatesSourceType.Favorite;
    const boatId = this.boatDetailsService.boatId as number;
    const params = new SharingOffersModalData(
      translate('search.modal.sharingCandidates'),
      '',
      type,
      boatId
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
}
