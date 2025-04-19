import { Injectable } from '@angular/core';
import { User } from './auth.modal';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Toastr } from '../shared/toastr.shared';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private toastr: Toastr
  ) {}
  private APIURL = 'http://localhost:3000/api/v1/auth';

  registerUser(data: Partial<User>) {
    return this.httpClient.post<{
      message: string;
      data: User;
    }>(`${this.APIURL}/register`, data);
  }

  loginUser(data: Partial<User>) {
    return this.httpClient.post<{
      message: string;
      data: User;
      token: string;
    }>(`${this.APIURL}/login`, data);
  }

  logOut() {
    this.cookieService.delete('jwt');
    this.cookieService.delete('role');
    this.router.navigate(['/loginUser']);
  }

  forgotPassword(email: string) {
    return this.httpClient.post(`${this.APIURL}/forget-password`, { email });
  }

  resetPassword(resetToken: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      this.toastr.showToast(
        'error',
        'Password and Confirm Password do not match'
      );
    }
    return this.httpClient.post(`${this.APIURL}/reset-password/${resetToken}`, {
      password,
    });
  }

  verifyAccount(otp: string) {
    return this.httpClient.post(`${this.APIURL}/verify-account`, {
      otp,
    });
  }

  resendOtp(email: string) {
    return this.httpClient.post(`${this.APIURL}/resend-otp`, { email });
  }
}
