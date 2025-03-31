import { Injectable } from '@angular/core';
import { User } from './auth.modal';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}
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
}
