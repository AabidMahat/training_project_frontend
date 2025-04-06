import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateWorkspaceComponent } from './create-workspace/create-workspace.component';
import { JoinWorkspaceComponent } from './join-workspace/join-workspace.component';
import { WorkspaceDetailComponent } from './workspace-details/workspace-details.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { AuthGuard } from '../guards/auth.guard';
import { UpdateWorkspaceComponent } from './update-workspace/update-workspace.component';

const routes: Routes = [
  {
    path: 'workspace',
    canActivate: [AuthGuard],

    component: WorkspaceComponent,
  },
  {
    path: 'workspace/:workspaceId',
    canActivate: [AuthGuard],

    component: WorkspaceDetailComponent,
  },
  {
    path: 'create-workspace',
    canActivate: [AuthGuard],

    component: CreateWorkspaceComponent,
  },
  {
    path: 'join-workspace/:workspaceId',
    canActivate: [AuthGuard],

    component: JoinWorkspaceComponent,
  },
  {
    path: 'update-workspace/:workspaceId',
    canActivate: [AuthGuard],
    component: UpdateWorkspaceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspaceRoutingModule {}
