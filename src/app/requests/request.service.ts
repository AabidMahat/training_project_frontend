import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Request {
  id: string;
  request_type: string;
  requested_role: string;
  status: string;
  user: any;
  workspace: any;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private APIURL = 'http://localhost:3000/api/v1';

  constructor(private httpCLient: HttpClient) {}

  showRequest() {
    return this.httpCLient.get<{
      message: string;
      data: Request[];
    }>(`${this.APIURL}/request/showRequest`);
  }

  approveRequest(userId: number, workspaceId: string) {
    return this.httpCLient.post<{
      message: string;
      data: Request;
    }>(`${this.APIURL}/request/approve/${workspaceId}/${userId}`, {});
  }
}
