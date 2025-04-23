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
import { ButtonComponent } from '../shared/button/button.component';
import { UpdateWorkspaceComponent } from './update-workspace/update-workspace.component';
import { FormatTime } from './time-ago.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    CreateWorkspaceComponent,
    JoinWorkspaceComponent,
    WorkspaceComponent,
    WorkspaceDetailComponent,
    UpdateWorkspaceComponent,
    ButtonComponent,
    FormatTime,
  ],
  imports: [
    WorkspaceRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserModule,
    DatePipe,
    FormsModule,
    QuillModule.forRoot(),
    NgxSpinnerModule.forRoot({
      type: 'square-jelly-box',
    }),
  ],

  exports: [
    CreateWorkspaceComponent,
    JoinWorkspaceComponent,
    WorkspaceComponent,
    WorkspaceDetailComponent,
    ButtonComponent,
    FormatTime,
  ],
})
export class WorkspaceModule {}
