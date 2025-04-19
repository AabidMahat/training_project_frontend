import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';

import { ChartsComponent } from './pages/charts/charts.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'dashboard',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./dashboard/workspace.module').then((m) => m.WorkspaceModule),
  },
  {
    path: 'documents',
    loadChildren: () =>
      import('./documents/document.module').then((m) => m.DocumentModule),
  },
  {
    path: 'request',
    canActivate: [AuthGuard],

    loadChildren: () =>
      import('./requests/request.module').then((m) => m.RequestModule),
  },
  {
    path: 'activity',
    canActivate: [AuthGuard],

    loadChildren: () =>
      import('./activity/activity.module').then((m) => m.ActivityModule),
  },
  {
    path: 'charts',
    component: ChartsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
