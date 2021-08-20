import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchCrewProfileComponent} from './components/search-crew-profile/search-crew-profile.component';

const routes: Routes = [
  {
    path: '',
    component: SearchCrewProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCrewProfileRoutingModule { }
