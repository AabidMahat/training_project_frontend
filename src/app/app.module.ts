import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';

import { QuillModule } from 'ngx-quill';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { WorkspaceComponent } from './dashboard/workspace/workspace.component';
import { DashboardDetailComponent } from './dashboard/workspace-details/workspace-details.component';
import { AuthInterceptor } from './auth.interceptor';
import { CreateWorkspaceComponent } from './dashboard/create-workspace/create-workspace.component';
import { JoinWorkspaceComponent } from './dashboard/join-workspace/join-workspace.component';
import { RouterModule } from '@angular/router';
import { AddDocumentComponent } from './documents/add-document/add-document.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkspaceComponent,
    DashboardDetailComponent,
    CreateWorkspaceComponent,
    JoinWorkspaceComponent,
    AddDocumentComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule,

    BrowserModule,
    AppRoutingModule,
    AuthModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    FormsModule,
    QuillModule.forRoot(),
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
