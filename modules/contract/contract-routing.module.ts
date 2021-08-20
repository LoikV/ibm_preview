import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SentContractComponent} from './components/sent-contract/sent-contract.component';


const routes: Routes = [
  {
    path: ':id',
    component: SentContractComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractRoutingModule { }
