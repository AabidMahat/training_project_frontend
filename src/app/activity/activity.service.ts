import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Activity {
  id: number;
  action: string;
  timestamp: Date;
  user: any;
  document: any | null;
  workspace: any | null;
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private APIURL = 'http://localhost:3000/api/v1';
  constructor(private httpClient: HttpClient) {}

  getAllActivity(page: number, limit: number) {
    return this.httpClient.get<{
      message: string;
      data: Activity[];
    }>(`${this.APIURL}/activity`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString()),
    });
  }
}
