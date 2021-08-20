import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {DestroySubscription} from '@helpers';
import {
  ChangeHiredStatusParams,
  ErrorDto,
  JobOfferFormMode,
  JobOfferFormModeData,
  JobOffersDirectories,
  JobOffersPayloadFormI, UnpublishOfferParamsI
} from '@models';
import {translate} from '@ngneat/transloco';
import {UnpublishJobOfferModalService} from '@shared/components/unpublish-job-offer/services/unpublish-job-offer-modal.service';
import {
  ConfirmationDialogDataI,
  ConfirmationDialogService,
  ConfirmationDialogType
} from '@shared/modules/confirmation-dialog';
import {EMPTY, Observable} from 'rxjs';
import {filter, map, switchMap, take, takeUntil} from 'rxjs/operators';
import {JobOfferModalClosePayload} from '../../models/job-offer-modal';
import {JobOfferManagerService} from '../../services/job-offer-manager.service';
import {NotificationService} from '@shared/modules/notification';
import {CustomOverlayRef} from '@shared/modules/modal';

@Component({
  selector: 'app-job-offer-modal',
  templateUrl: './job-offer-modal.component.html',
  styleUrls: ['./job-offer-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class JobOfferModalComponent extends DestroySubscription implements OnInit {

  public directories$: Observable<JobOffersDirectories>;
  public data: JobOfferFormModeData;
  public errors: ErrorDto;

  constructor(
    private readonly jobOfferManagerService: JobOfferManagerService,
    @Inject(CustomOverlayRef) private readonly overlayRef: CustomOverlayRef,
    private readonly confirmationDialogService: ConfirmationDialogService,
    private readonly unpublishJobOfferService: UnpublishJobOfferModalService,
    private readonly cdr: ChangeDetectorRef,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  ngOnInit() {
    this.directories$ = this.jobOfferManagerService.directories$;
    this.data = this.overlayRef.data;
  }

  public saveJobOffer(data: JobOffersPayloadFormI) {
    const hiredUnpublishParams = this.data.changeHiredParams;
    if (data.published && hiredUnpublishParams && hiredUnpublishParams.hired && !hiredUnpublishParams.publishStatus) {
      this.saveHiredUnpublishOffer(data);
      return;
    }
    this.saveSimpleOffer(data, hiredUnpublishParams);
  }

  public saveHiredUnpublishOffer(data: JobOffersPayloadFormI): void {
    const mode = this.data.mode;
    const title = translate('jobOffer.modal.publishOfferMsg');
    const config: ConfirmationDialogDataI = {
      title,
      applyAction: translate('jobOffer.actions.publish'),
      translate: false,
      type: ConfirmationDialogType.ATTENTION
    };
    this.confirmationDialogService.openAndConfirm(config)
      .pipe(
        switchMap(res => {
          if (res) {
            return this.jobOfferManagerService.saveJobOffer(data, mode);
          }
          return EMPTY;
        }),
        takeUntil(this.destroyStream$)
      )
      .subscribe(
        (item) => {
          this.close({action: 'addOrEdit', status: item.published});
        },
        err => {
          this.onErrorSave(err);
        }
      );
  }

  public saveSimpleOffer(data: JobOffersPayloadFormI, hiredUnpublishParams: ChangeHiredStatusParams): void {
    const mode = this.data.mode;
    if (hiredUnpublishParams && hiredUnpublishParams.publishStatus && !data.published) {
      this.saveSimpleUnpublishOffer(data, mode);
      return;
    }
    this.saveSimplePublishOffer(data, mode);
  }

  public saveSimplePublishOffer(data: JobOffersPayloadFormI, mode: JobOfferFormMode) {
    this.jobOfferManagerService.saveJobOffer(data, mode).pipe(
      takeUntil(this.destroyStream$)
    ).subscribe(
      (item) => {
        this.close({action: 'addOrEdit', status: item.published});
      },
      err => {
        this.onErrorSave(err);
      }
    );
  }

  public saveSimpleUnpublishOffer(data: JobOffersPayloadFormI, mode: JobOfferFormMode): void {
    const {id, createdByCrewAgency} = data;
    if (!id) {
      return;
    }
    this.unpublishJobOfferService.open({offerId: id, createdByCrewAgency}).pipe(
      switchMap(res => {
        if (!res) {
          return EMPTY;
        }
        return this.jobOfferManagerService.saveJobOffer(data, mode, res.updateCrew, res.reason);
      }),
      take(1),
      takeUntil(this.destroyStream$)
    )
      .subscribe(
        (item) => {
          this.close({action: 'addOrEdit', status: item.published});
        },
        err => {
          this.onErrorSave(err);
        }
      );
  }

  private onErrorSave(err: ErrorDto): void {
    this.errors = err;
    const msg = translate('errors.incorrectlyFilledFields');
    this.notificationService.error(msg);
    this.cdr.detectChanges();
  }

  public removeJobOffer() {
    const title = translate('jobOffer.delete');
    const config: ConfirmationDialogDataI = {
      title,
      applyAction: translate('actions.delete'),
      translate: false,
      type: ConfirmationDialogType.ATTENTION
    };
    this.confirmationDialogService.openAndConfirm(config)
      .pipe(
        switchMap(data => {
          if (data) {
            const id = this.data.item.id;
            return this.jobOfferManagerService.removeOffer(id);
          }
          return EMPTY;
        }),
        takeUntil(this.destroyStream$)
      )
      .subscribe(() => {
        this.close({action: 'remove', status: null});
      });
  }

  public cancelJobOffer() {
    this.close();
  }

  private close(data: JobOfferModalClosePayload | null = null): void {
    this.overlayRef.close(data);
  }
}
