import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppRouterService} from '@core/services';
import {ContractViewI} from '@models';
import {Observable} from 'rxjs';
import {SentContractService} from '../../services/sent-contract.service';

@Component({
  selector: 'app-sent-contract',
  templateUrl: './sent-contract.component.html',
  styleUrls: ['./sent-contract.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SentContractComponent implements OnInit {

  public contractDetails$: Observable<ContractViewI>;
  constructor(
    private readonly sentContractService: SentContractService,
    private readonly route: ActivatedRoute,
    private readonly appRouterService: AppRouterService,
    ) { }

  ngOnInit() {
    const id = this.getContractInvitationId();
    this.contractDetails$ = this.sentContractService.getContract(id);
  }

  private getContractInvitationId(): number {
    const id = this.route.snapshot.paramMap.get('id');
    const parsedId = id && parseInt(id, 10);
    if (!parsedId) {
      throw new Error('No invitation contract params');
    }
    return parsedId;
  }

  public onBack(): void {
    this.appRouterService.goBack();
  }
}
