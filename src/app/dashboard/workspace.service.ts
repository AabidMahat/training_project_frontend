import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Workspace } from './workspace.modal';
import { BehaviorSubject } from 'rxjs';

export interface WorkspaceData {
  id: string;
  document: any[];
  workspaceUser: any[];
  name: string;
}

export interface JoinData {
  name: string | null;
  request_type: string | null;
  requested_role: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private APIURL = 'http://localhost:3000/api/v1';

  workspaceSubject = new BehaviorSubject<WorkspaceData | null>(null);
  workspaceData$ = this.workspaceSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  getAllWorkspace() {
    return this.httpClient.get<{
      data: Workspace[];
    }>(`${this.APIURL}/workspace`);
  }

  createWorkspace(name: string) {
    return this.httpClient.post<{
      message: string;
      workspace: Workspace;
    }>(`${this.APIURL}/workspace`, {
      name,
    });
  }

  getWorkspaceById(workspaceId: string) {
    return this.httpClient.get<{
      message: string;
      data: WorkspaceData;
    }>(`${this.APIURL}/workspace/getWorkspace/${workspaceId}`);
  }

  joinWorkspace(workspaceId: string, joinData: JoinData) {
    return this.httpClient.post<{
      message: string;
    }>(`${this.APIURL}/workspaceUser/sendRequest/${workspaceId}`, joinData);
  }
}
