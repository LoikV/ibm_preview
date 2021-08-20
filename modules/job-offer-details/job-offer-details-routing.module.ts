import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JobOfferDetailsWrapperComponent} from './components/job-offer-details-wrapper/job-offer-details-wrapper.component';
import {OfferedUsersAppliedComponent} from './components/offered-users-applied/offered-users-applied.component';
import {OfferedUsersSentComponent} from './components/offered-users-sent/offered-users-sent.component';


const routes: Routes = [
  {
    path: ':id',
    component: JobOfferDetailsWrapperComponent,
    children: [
      // {
      //   path: 'matching',
      //   component: OfferedUsersMatchingComponent
      // },
      {
        path: 'applied',
        component: OfferedUsersAppliedComponent
      },
      {
        path: 'sent',
        component: OfferedUsersSentComponent
      },
      {
        path: '',
        redirectTo: 'applied'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobOfferDetailsRoutingModule { }
