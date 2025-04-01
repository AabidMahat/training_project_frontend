import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { WorkspaceComponent } from './dashboard/workspace/workspace.component';
import { DashboardDetailComponent } from './dashboard/workspace-details/workspace-details.component';
import { CreateWorkspaceComponent } from './dashboard/create-workspace/create-workspace.component';
import { JoinWorkspaceComponent } from './dashboard/join-workspace/join-workspace.component';
import { AddDocumentComponent } from './documents/add-document/add-document.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: WorkspaceComponent,
    children: [],
  },
  {
    path: 'workspace/:workspaceId',
    component: DashboardDetailComponent,
  },
  {
    path: 'create-workspace',
    component: CreateWorkspaceComponent,
  },
  {
    path: 'join-workspace/:workspaceId',
    component: JoinWorkspaceComponent,
  },
  {
    path: 'add-document/:workspaceId',
    component: AddDocumentComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
