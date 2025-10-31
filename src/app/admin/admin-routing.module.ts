import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: 'user-list',
        loadChildren: () =>
          import('./user-list/user-list.module').then(
            (m) => m.UserListPageModule
          ),
      },
      {
        path: 'movie-list',
        loadChildren: () =>
          import('./movie-list/movie-list.module').then(
            (m) => m.MovieListPageModule
          ),
      },
      { path: '', redirectTo: 'user-list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
