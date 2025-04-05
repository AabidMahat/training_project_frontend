import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AddDocumentComponent } from './documents/add-document/add-document.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { ShowDocumentsComponent } from './documents/show-documents/show-documents.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'loginUser',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./dashboard/workspace.module').then((m) => m.WorkspaceModule),
  },
  {
    path: 'add-document/:workspaceId',
    canActivate: [AuthGuard],

    component: AddDocumentComponent,
  },
  {
    path: 'show-documents',
    canActivate: [AuthGuard],
    component: ShowDocumentsComponent,
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
