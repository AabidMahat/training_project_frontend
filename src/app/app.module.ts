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
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { WorkspaceModule } from './dashboard/workspace.module';
import { RequestModule } from './requests/request.module';
import { ActivityModule } from './activity/activity.module';
import { HomeComponent } from './home/home.component';
import { TimeAgoPipe } from './home/time.pipe';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { DocumentModule } from './documents/document.module';
import { ChartsComponent } from './pages/charts/charts.component';
import { HighchartsChartModule } from 'highcharts-angular';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [AppComponent, HomeComponent, TimeAgoPipe, ChartsComponent],
  imports: [
    BrowserAnimationsModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,

    AuthModule,
    WorkspaceModule,
    RequestModule,
    ActivityModule,
    DocumentModule,

    HighchartsChartModule,

    // AngularFontAwesomeModule,

    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      closeButton: true,
      onActivateTick: true,
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true,
      tapToDismiss: true,
      enableHtml: true,
      maxOpened: 1,
      autoDismiss: true,
      countDuplicates: true,
      newestOnTop: true,
    }),
    FormsModule,
    QuillModule.forRoot(),

    SocketIoModule.forRoot(config),
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
