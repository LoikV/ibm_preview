import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchSendCrewContractComponent} from './components/search-send-crew-contract/search-send-crew-contract.component';

const routes: Routes = [
  {
    path: '',
    component: SearchSendCrewContractComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchSendCrewContractRoutingModule { }
