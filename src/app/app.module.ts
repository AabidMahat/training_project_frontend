import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';

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

@NgModule({
  declarations: [AppComponent, WorkspaceComponent, DashboardDetailComponent, CreateWorkspaceComponent],
  imports: [
    BrowserAnimationsModule,

    BrowserModule,
    AppRoutingModule,
    AuthModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
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
