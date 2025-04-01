import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Document {
  id: number;
  title: string | null;
  content: string | null;
  documentUrl: string;
  document: File | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private APIURL = 'http://localhost:3000/api/v1';
  constructor(private httpClient: HttpClient) {}

  addDocumentToWorkspace(workspaceId: string, data: Partial<Document>) {
    return this.httpClient.patch(
      `${this.APIURL}/document/addDocument/${workspaceId}`,
      data
    );
  }
}
