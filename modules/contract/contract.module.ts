import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SentContractComponent} from './components/sent-contract/sent-contract.component';
import {ContractRoutingModule} from './contract-routing.module';
import {SentContractService} from './services/sent-contract.service';
import {SeazoneIconRegistryService, SeazoneIconsModule, shevronIcon} from '@shared/modules/seazone-icons';
import {CrewContractDetailsModule} from '@shared/components/crew-contract-details';
import {CustomLoaderModule} from '@shared/modules/custom-loader';

@NgModule({
  declarations: [SentContractComponent],
  imports: [
    CommonModule,
    ContractRoutingModule,
    CrewContractDetailsModule,
    CustomLoaderModule,
    SeazoneIconsModule,
  ],
  providers: [SentContractService]
})
export class ContractModule {
  constructor(
    private readonly seazoneIconRegistryService: SeazoneIconRegistryService,
  ) {
    this.seazoneIconRegistryService.registerIcons([
      shevronIcon,
    ]);
  }
}
