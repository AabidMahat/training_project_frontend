import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Document {
  id: number;
  title: string | null;
  content: string | null;

  isActive: boolean | null;
  documentUrl: string;
  document: File | null;
  createdAt: Date;
  updatedAt: Date;

  user?: any;
  workspace?: any;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private APIURL = 'http://localhost:3000/api/v1';
  constructor(private httpClient: HttpClient) {}

  addDocumentToWorkspace(workspaceId: string, data: FormData) {
    return this.httpClient.post(
      `${this.APIURL}/document/addDocument/${workspaceId}`,
      data
    );
  }

  getDocumentById(documentId: number) {
    return this.httpClient.get<{
      message: string;
      data: Partial<Document>;
    }>(`${this.APIURL}/document/${documentId}`);
  }

  updateDocument(documentId: number, content: string) {
    return this.httpClient.patch(
      `${this.APIURL}/document/update/${documentId}`,
      {
        content,
      }
    );
  }

  getOwnerDocument(userId: number) {
    console.log({ userId });
    return this.httpClient.get<{
      message: string;
      data: Document[];
    }>(`${this.APIURL}/document/getOwnerDocument/${userId}`);
  }

  deleteDocument(documentId: number, userId: number) {
    return this.httpClient.delete(
      `${this.APIURL}/document/${documentId}/${userId}`
    );
  }

  getDocuments() {
    return this.httpClient.get<{
      message: string;
      data: Document[];
    }>(`${this.APIURL}/document/all-documents`);
  }

  changeStatus(documentId: number, status: boolean) {
    return this.httpClient.patch(
      `${this.APIURL}/document/change-status/${documentId}`,
      { status }
    );
  }
}
