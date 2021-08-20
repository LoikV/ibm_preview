import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FeatureToggleGuard} from '@core/modules/feature-toggle/guards/feature-toggle.guard';
import {PermissionGuard} from '@shared/modules/permissions';
import {BoatSearchCrewComponent} from './components/boat-search-crew/boat-search-crew.component';
import {BoatSearchCrewPermissionGuard} from './guards/boat-search-crew-permission.guard';



const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('@shared/components/seazone-plug').then(m => m.SeazonePlugModule)
  // },
  {
    path: 'job-offer',
    canActivate: [FeatureToggleGuard, PermissionGuard],
    data: {
      features: 'feature-offers',
      permission: 'perm_search_job_offer_view',
    },
    loadChildren: () => import('./modules/job-offer-details/job-offer-details.module')
      .then(m => m.JobOfferDetailsModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/search-crew-profile/search-crew-profile.module').then(m => m.SearchCrewProfileModule),
    canActivate: [FeatureToggleGuard, PermissionGuard],
    data: {
      features: 'feature-offers',
      permission: ['perm_search_job_offer_view', 'perm_search_crew_search'],
    },
  },
  {
    path: 'contract',
    loadChildren: () => import('./modules/search-send-crew-contract/search-send-crew-contract.module')
      .then(m => m.SearchSendCrewContractModule),
    canActivate: [FeatureToggleGuard, PermissionGuard],
    data: {
      features: 'feature-offers',
      permission: 'perm_search_add_crew',
    },
  },
  {
    path: 'see-contract',
    loadChildren: () => import('./modules/contract/contract.module')
    .then(m => m.ContractModule),
  },
  {
    path: '',
    component: BoatSearchCrewComponent,
    children: [
      {
        path: 'crew',
        loadChildren: () => import('./modules/search-crew/search-crew.module').then(m => m.SearchCrewModule),
        canActivate: [FeatureToggleGuard, BoatSearchCrewPermissionGuard],
        data: {
          features: 'search-crew',
          permission: 'perm_search_crew_search',
          redirectPermission: 'perm_search_job_offer_view',
          redirectUrl: 'offers',
        },
      },
      {
        path: 'offers',
        loadChildren: () => import('./modules/job-offers/job-offers.module').then(m => m.JobOffersModule),
        canActivate: [FeatureToggleGuard, BoatSearchCrewPermissionGuard],
        data: {
          features: 'feature-offers',
          permission: 'perm_search_job_offer_view',
          redirectPermission: 'perm_search_crew_search',
          redirectUrl: 'crew',
        },
      },
      {
        path: '**',
        redirectTo: 'crew',
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoatSearchCrewRoutingModule { }
