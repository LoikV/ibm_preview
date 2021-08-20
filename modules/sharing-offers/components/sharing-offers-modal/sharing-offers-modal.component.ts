import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {CustomOverlayRef, MODAL_DATA} from '@shared/modules/modal';
import {
  ChangeSelectedOfferActionI,
  SharingCandidatesSourceType,
  SharingOffersData, SharingOffersModalData,
  SharingOffersPayloadParams
} from '../../models/sharing-offers-group.model';
import {SharingOffersService} from '../../services/sharing-offers.service';
import {startWith, switchMap, takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {NotificationService} from '@shared/modules/notification';
import {translate} from '@ngneat/transloco';
import {EMPTY, Subject} from 'rxjs';
import {SharingBase} from '@shared/components/sharing/models/sharing-base';
import {SharingService} from '@shared/components/sharing/services/sharing/sharing.service';
import {SharingModalService} from '@shared/components/sharing-modal/services/sharing-modal.service';
import * as is from 'is_js';
import {SharedApiUrl, SharedTargetUrl, SharingConfigI} from '@shared/components/sharing';
import {Observable} from 'rxjs/internal/Observable';
import {FormControl} from '@angular/forms';
import {environment} from '@environments/environment';
import {BoatDetailsService} from '@services';

@Component({
  selector: 'app-sharing-offers-modal',
  templateUrl: './sharing-offers-modal.component.html',
  styleUrls: ['./sharing-offers-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharingOffersModalComponent extends SharingBase implements OnInit, OnDestroy {

  public changePage$ = new Subject<number>();
  public sharingOffersList: SharingOffersData;
  public selectedActions: number[];
  public config: SharingConfigI;
  public selectedAllControl: FormControl | null;
  public sharingCandidatesSourceType = SharingCandidatesSourceType;
  constructor(
    private readonly dialogRef: CustomOverlayRef,
    @Inject(MODAL_DATA) public readonly data: SharingOffersModalData,
    private readonly sharingOffersService: SharingOffersService,
    private cdr: ChangeDetectorRef,
    protected readonly sharingService: SharingService,
    protected readonly notificationService: NotificationService,
    protected readonly sharingModalService: SharingModalService,
    protected readonly boatDetailsService: BoatDetailsService,
  ) {
    super(
      notificationService,
      sharingModalService,
      sharingService,
    );
  }

  ngOnInit(): void {
    this.іmplementConf();
    this.getSharingOfferList();
    this.checkAndInitSelectAllControl();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.changePage$.complete();
  }


  private іmplementConf(): void {
    const targetPath = this.data.type === SharingCandidatesSourceType.JobOffer ?
      SharedTargetUrl.JobOfferCandidates : SharedTargetUrl.CrewFavoriteCandidates;
    this.config = {
      apiPath: SharedApiUrl.JobOfferCandidates,
      targetPath
    };
  }

  private checkAndInitSelectAllControl() {
    if (this.data.type === SharingCandidatesSourceType.Favorite) {
      this.selectedAllControl = new FormControl(false);
    }
  }

  private getSharingOfferList(): void {
    const limit = 5;
    this.changePage$.pipe(
      startWith(1),
      switchMap(page => {
        return this.selectSourceOfData(page);
        }
      )
    )
   .pipe(
      takeUntil(this.destroyStream$)
    )
      .subscribe(data => {
        const updatedDataCandidates = this.checkAndUpdateCandidateList(data);
        this.sharingOffersList = updatedDataCandidates;
        if (!this.selectedActions) {
          this.selectedActions = [...this.sharingOffersList.crewInProcess];
        }
        this.cdr.detectChanges();
      });
  }

  private selectSourceOfData(page: number): Observable<SharingOffersData> {
    const limit = 5;
    const type = this.data.type;
    switch (type) {
      case SharingCandidatesSourceType.JobOffer: {
        return this.sharingOffersService.getSharingCandidatesListForOffer(page, limit, this.data.id);
        break;
      }
      case SharingCandidatesSourceType.Favorite: {
        return this.sharingOffersService.getSharingCandidatesListForFavorites(page, limit, this.data.id);
        break;
      }
      default: {
        return EMPTY;
      }
    }
  }

  onChangePage(page: number): void {
    this.changePage$.next(page);
  }

  public changeSelectStatusAction(data: ChangeSelectedOfferActionI): void {
    if (data.value) {
      this.selectedActions.push(data.id);
    }
    else {
      this.selectedActions = this.selectedActions.filter(el => el !== data.id);
    }
    this.checkSelectAll(data.value);
    this.cdr.detectChanges();
  }

  private checkSelectAll(value: boolean): void {
    if (!this.selectedAllControl) {
      return;
    }
    if (value && this.selectedActions.length === this.sharingOffersList.crewAll.length) {
      this.selectedAllControl.reset(true);
    }

    if (this.selectedAllControl.value && !value) {
      this.selectedAllControl.reset(false);
    }

  }
  public changeSelectAll(status: boolean): void {
    this.selectedActions = status ? [...this.sharingOffersList.crewAll] : [];
    this.sharingOffersList = this.data.type === this.sharingCandidatesSourceType.Favorite ?
      this.checkAndUpdateFavoriteList(this.sharingOffersList) : this.checkAndUpdateCandidateList(this.sharingOffersList);

  }


  public checkAndUpdateCandidateList(data: SharingOffersData): SharingOffersData {
    if (!this.selectedActions) {
      data.list.forEach(el => el.selected = data.crewInProcess.includes(el.jobOfferInvitationId) || false);
    } else {
      data.list.forEach(el => el.selected = this.selectedActions.includes(el.jobOfferInvitationId) || false);
    }
    return data;
  }

  public checkAndUpdateFavoriteList(data: SharingOffersData): SharingOffersData {
    if (!this.selectedActions) {
      data.list.forEach(el => el.selected = data.crewInProcess.includes(el.id) || false);
    } else {
      data.list.forEach(el => el.selected = this.selectedActions.includes(el.id) || false);
    }
    return data;
  }

  public cancel(): void {
    this.dialogRef.close(null);
  }

  public shareActions(): void {
    const payload = new SharingOffersPayloadParams(this.data.id, this.selectedActions);
    this.sharingOffersService.getSharingLink(payload, this.data.type).pipe(
      takeUntil(this.destroyStream$)
    ).subscribe( hash => {
      this.dialogRef.close(null);
      const isDesktop = is.desktop();
      if (navigator && !!navigator.share && !isDesktop) {
        try {
          navigator.share({
            title: translate('jobOffer.actions.sharedCandidates'),
            url: this.createPath(hash)
          }).catch(() => this.addLinkToClipBoard(hash));
        } catch {
          this.addLinkToClipBoard(hash);
        }
        return;
      }
      this.addLinkToClipBoard(hash);
    });
  }

  public createPath(token: string) {
    const boatId = this.boatDetailsService.boatId;
    const path = this.config.targetPath;
    return `${environment.baseUrl}/${path}/?token=${token}&boatId=${boatId}`;
  }

}

