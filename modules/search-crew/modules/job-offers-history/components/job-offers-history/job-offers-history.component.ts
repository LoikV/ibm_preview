import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DestroySubscription} from '@helpers';
import {CrewSearchOfferHistoryItemDto, CrewSearchOfferPaginationParams, CrewSearchOffersHistoryDto} from '@models';
import {BehaviorSubject, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {JobOfferHistoryModalDataI} from '../../models/job-offer-history-modal';
import {JobOffersHistoryService} from '../../services/job-offers-history.service';
import {MODAL_DATA} from '@shared/modules/modal';

@Component({
  selector: 'app-job-offers-history',
  templateUrl: './job-offers-history.component.html',
  styleUrls: ['./job-offers-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobOffersHistoryComponent extends DestroySubscription implements OnInit, OnDestroy {

  private readonly paginationParams$ = new BehaviorSubject(new CrewSearchOfferPaginationParams());
  public data$: Observable<CrewSearchOffersHistoryDto>;

  constructor(
    @Inject(MODAL_DATA) private readonly modalData: JobOfferHistoryModalDataI,
    private readonly jobOffersHistoryService: JobOffersHistoryService,
  ) {
    super();
  }

  ngOnInit() {
    this.data$ = this.getHistory();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.paginationParams$.complete();
  }

  public trackById(index: number, item: CrewSearchOfferHistoryItemDto): number {
    return item.jobOfferId;
  }

  public onChangePage(page: number): void {
    const value = this.paginationParams$.value;
    if (value.page === page) {
      return;
    }
    this.paginationParams$.next({...value, page});
  }

  private getHistory(): Observable<CrewSearchOffersHistoryDto> {
    const userId = this.modalData.userId;
    return this.paginationParams$.pipe(
      switchMap((params => this.jobOffersHistoryService.getJobOfferHistory(userId, params)))
    );
  }

}
