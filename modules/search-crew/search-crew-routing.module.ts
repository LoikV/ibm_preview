import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchCrewAllComponent} from './components/search-crew-all/search-crew-all.component';
import {SearchCrewFavoritesComponent} from './components/search-crew-favorites/search-crew-favorites.component';
import {SearchCrewNotRelevantComponent} from './components/search-crew-not-relevant/search-crew-not-relevant.component';
import {SearchCrewWrapperComponent} from './components/search-crew-wrapper/search-crew-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: SearchCrewWrapperComponent,
    children: [
      {
        path: 'all',
        children: [
          {
            path: 'profile',
            loadChildren: () => import('../search-crew-profile/search-crew-profile.module')
              .then(m => m.SearchCrewProfileModule),
          },
          {
            path: '',
            component: SearchCrewAllComponent,
          }
        ]
      },
      {
        path: 'favorite',
        children: [
          {
            path: 'profile',
            loadChildren: () => import('../search-crew-profile/search-crew-profile.module')
              .then(m => m.SearchCrewProfileModule),
          },
          {
            path: '',
            component: SearchCrewFavoritesComponent,
          },
        ],
      },
      {
        path: 'not-relevant',
        children: [
          {
            path: 'profile',
            loadChildren: () => import('../search-crew-profile/search-crew-profile.module')
              .then(m => m.SearchCrewProfileModule),
          },
          {
            path: '',
            component: SearchCrewNotRelevantComponent,
          },
        ]
      },
      {
        path: '',
        redirectTo: 'all',
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCrewRoutingModule { }
