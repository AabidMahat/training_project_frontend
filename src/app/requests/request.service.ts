import { HttpClient, HttpParams } from '@angular/common/http';
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

  showRequest(page: number, limit: number) {
    return this.httpCLient.get<{
      message: string;
      data: Request[];
    }>(`${this.APIURL}/request/showRequest`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString()),
    });
  }

  approveRequest(userId: number, workspaceId: string) {
    return this.httpCLient.post<{
      message: string;
      data: Request;
    }>(`${this.APIURL}/request/approve/${workspaceId}/${userId}`, {});
  }
}
