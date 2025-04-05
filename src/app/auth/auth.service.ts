import { Injectable } from '@angular/core';
import { User } from './auth.modal';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private router: Router
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
    this.router.navigate(['/loginUser']);
  }
}
