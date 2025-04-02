import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateWorkspaceComponent } from './create-workspace/create-workspace.component';
import { JoinWorkspaceComponent } from './join-workspace/join-workspace.component';
import { WorkspaceDetailComponent } from './workspace-details/workspace-details.component';
import { WorkspaceComponent } from './workspace/workspace.component';

const routes: Routes = [
  {
    path: 'workspace',
    component: WorkspaceComponent,
  },
  {
    path: 'workspace/:workspaceId',
    component: WorkspaceDetailComponent,
  },
  {
    path: 'create-workspace',
    component: CreateWorkspaceComponent,
  },
  {
    path: 'join-workspace/:workspaceId',
    component: JoinWorkspaceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspaceRoutingModule {}
