import { RouterModule, Routes } from '@angular/router';
import { RedirectAuthGuard } from '../guards/redirect.guard';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResendOtpComponent } from './resend-otp/resend-otp.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'loginUser',
    component: LoginComponent,
    resolve: [RedirectAuthGuard],
  },
  {
    path: 'verify-account',
    component: VerifyOtpComponent,
  },
  //   {
  //     path: 'resend-otp',
  //     component: ResendOtpComponent,
  //   },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  {
    path: 'reset-password/:resetToken',
    component: ResetPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
