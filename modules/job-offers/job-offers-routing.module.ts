import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JobOffersWrapperComponent} from './components/job-offers-wrapper/job-offers-wrapper.component';
import {JobOffersComponent} from './components/job-offers/job-offers.component';
import {UnpublishedJobOffersComponent} from './components/unpublished-job-offers/unpublished-job-offers.component';


const routes: Routes = [
  {
    path: '',
    component: JobOffersWrapperComponent,
    children: [
      {
        path: 'published',
        component: JobOffersComponent
      },
      {
        path: 'unpublished',
        component: UnpublishedJobOffersComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'published'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobOffersRoutingModule { }
