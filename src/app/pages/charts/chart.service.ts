import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor(private httpClient: HttpClient) {}

  private API = 'http://localhost:3000/api/v1';

  getUserByWorkspaceGroup() {
    return this.httpClient.get<{
      message: string;
      data: any[];
    }>(`${this.API}/workspaceUser/getUserByWorkspacesGroup`);
  }

  getRequestByWorkspaceGroup() {
    return this.httpClient.get<{
      message: string;
      data: any[];
    }>(`${this.API}/request/getRequestByWorkspace`);
  }

  showAllActivity() {
    return this.httpClient.get<{
      message: string;
      data: any[];
    }>(`${this.API}/activity`);
  }
}
