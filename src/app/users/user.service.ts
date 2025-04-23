import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface UserData {
  id: number;
  name: string;
  email: string;
  isActive: boolean;

  createdAt: Date;

  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private APIURL = 'http://localhost:3000/api/v1';

  constructor(private httpClient: HttpClient) {}

  getAllUsers() {
    return this.httpClient.get<{
      message: string;
      data: Partial<UserData>[];
    }>(`${this.APIURL}/auth/get-users`);
  }

  changeUserStatus(userId: number, isActive: boolean) {
    return this.httpClient.post<{
      message: string;
    }>(`${this.APIURL}/auth/chnage-status/${userId}`, {
      isActive,
    });
  }
}
