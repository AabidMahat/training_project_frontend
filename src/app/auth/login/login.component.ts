// login.component.ts
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, catchError, throwError } from 'rxjs';
import { User } from '../auth.modal';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Toastr } from '../../shared/toastr.shared';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { ResendOtpComponent } from '../resend-otp/resend-otp.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private toastr: Toastr,
    private cookieService: CookieService,
    private router: Router
  ) {}

  @ViewChild('forgetPassword', { read: ViewContainerRef, static: true })
  forgetPasswordContainer!: ViewContainerRef;

  @ViewChild('resendOtp', { static: true, read: ViewContainerRef })
  resendOtpContainer!: ViewContainerRef;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService
        .loginUser(this.loginForm.value as Partial<User>)
        .pipe(
          catchError((err) => {
            console.error('Login failed:', err);
            return throwError(() => err);
          })
        )
        .subscribe({
          next: (data) => {
            this.cookieService.set('jwt', data.token);
            this.cookieService.set('role', data.data.role);

            this.toastr.showToast('success', 'Login Successful');
            this.router.navigate(['/workspace']);

            console.log('Login Successful:', data);
          },
          error: (err: HttpErrorResponse) => {
            // this.toastr.showToast('error', 'Incorrect Email Or Password');
            console.log('Error:', err.error);
          },
        });
    }
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  showForgetPassword() {
    console.log(this.forgetPasswordContainer);
    this.forgetPasswordContainer.clear();
    const containerRef = this.forgetPasswordContainer.createComponent(
      ForgetPasswordComponent
    );

    containerRef.instance.closeForgotPasswordModal.subscribe({
      next: () => {
        this.forgetPasswordContainer.clear();
      },
    });
  }

  showResendOtp() {
    this.resendOtpContainer.clear();

    const containerRef =
      this.resendOtpContainer.createComponent(ResendOtpComponent);

    containerRef.instance.closeOtpForm.subscribe({
      next: () => {
        this.resendOtpContainer.clear();
      },
    });
  }
}
