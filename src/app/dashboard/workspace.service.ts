import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Workspace } from './workspace.modal';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private APIURL = 'http://localhost:3000/api/v1/workspace';

  constructor(private httpClient: HttpClient) {}

  getAllWorkspace() {
    return this.httpClient.get<{
      data: Workspace[];
    }>(`${this.APIURL}`);
  }

  createWorkspace(name: string) {
    return this.httpClient.post<{
      message: string;
      workspace: Workspace;
    }>(`${this.APIURL}`, {
      name,
    });
  }

  getWorkspaceById(workspaceId: string) {
    return this.httpClient.get<{
      message: string;
      data: {
        id: string;
        document: any[];
        workspaceUser: any[];
        name: string;
      };
    }>(`${this.APIURL}/getWorkspace/${workspaceId}`);
  }
}
