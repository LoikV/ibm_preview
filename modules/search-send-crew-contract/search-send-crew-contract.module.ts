import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SendCrewContractModule} from '@shared/modules/send-crew-contract';
import {SearchSendCrewContractComponent} from './components/search-send-crew-contract/search-send-crew-contract.component';
import {SearchSendCrewContractRoutingModule} from './search-send-crew-contract-routing.module';

@NgModule({
  declarations: [SearchSendCrewContractComponent],
  imports: [
    CommonModule,
    SearchSendCrewContractRoutingModule,
    SendCrewContractModule,
  ]
})
export class SearchSendCrewContractModule { }
