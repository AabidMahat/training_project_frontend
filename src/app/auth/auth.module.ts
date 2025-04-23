import { GenericCardComponent } from './../shared/generic-card/generic-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgOtpInputModule } from 'ng-otp-input';

import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ResendOtpComponent } from './resend-otp/resend-otp.component';
import { AuthRoutingModule } from './auth.routing';
import { AppModule } from '../app.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    VerifyOtpComponent,
    ResendOtpComponent,
    GenericCardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    BrowserModule,
    NgOtpInputModule,
    AuthRoutingModule,

    NgxSpinnerModule.forRoot({
      type: 'square-jelly-box',
    }),
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    GenericCardComponent,
  ],
})
export class AuthModule {}
