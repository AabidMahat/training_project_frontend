import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreateWorkspaceComponent } from './create-workspace/create-workspace.component';
import { JoinWorkspaceComponent } from './join-workspace/join-workspace.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspaceDetailComponent } from './workspace-details/workspace-details.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { WorkspaceRoutingModule } from './workspace.routing';

@NgModule({
  declarations: [
    CreateWorkspaceComponent,
    JoinWorkspaceComponent,
    WorkspaceComponent,
    WorkspaceDetailComponent,
  ],
  imports: [
    WorkspaceRoutingModule,

    ReactiveFormsModule,
    RouterModule,
    BrowserModule,
    DatePipe,
    FormsModule,
    QuillModule.forRoot(),
  ],

  exports: [
    CreateWorkspaceComponent,
    JoinWorkspaceComponent,
    WorkspaceComponent,
    WorkspaceDetailComponent,
  ],
})
export class WorkspaceModule {}
