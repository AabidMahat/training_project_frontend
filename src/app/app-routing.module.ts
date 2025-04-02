import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AddDocumentComponent } from './documents/add-document/add-document.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/workspace.module').then((m) => m.WorkspaceModule),
  },
  {
    path: 'add-document/:workspaceId',
    component: AddDocumentComponent,
  },
  {
    path: 'request',
    loadChildren: () =>
      import('./requests/request.module').then((m) => m.RequestModule),
  },
  {
    path: 'activity',
    loadChildren: () =>
      import('./activity/activity.module').then((m) => m.ActivityModule),
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'loginUser',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
