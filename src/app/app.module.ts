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

import { AuthInterceptor } from './interceptor/auth.interceptor';

import { RouterModule } from '@angular/router';
import { AddDocumentComponent } from './documents/add-document/add-document.component';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { WorkspaceModule } from './dashboard/workspace.module';
import { RequestModule } from './requests/request.module';
import { ActivityModule } from './activity/activity.module';
import { HomeComponent } from './home/home.component';
import { TimeAgoPipe } from './home/time.pipe';
import { ShowDocumentComponent } from './documents/show-documents/show-documents.component';

@NgModule({
  declarations: [
    AppComponent,
    AddDocumentComponent,
    HomeComponent,
    TimeAgoPipe,
    ShowDocumentComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,

    AuthModule,
    WorkspaceModule,
    RequestModule,
    ActivityModule,

    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
    }),
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
