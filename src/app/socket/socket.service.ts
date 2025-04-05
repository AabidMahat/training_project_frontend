import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  joinWorkspace(workspaceId: string, userId: string) {
    this.socket.emit('joinWorkspace', { workspaceId, userId });
  }

  editDocument(documentId: string, content: string, userId: string) {
    this.socket.emit('editDocument', { documentId, content, userId });
  }

  getDocumentUpdates() {
    return this.socket.fromEvent<string>('updateDocument');
  }

  getActiveUser() {
    return this.socket.fromEvent<string[]>('updateUserList');
  }
}
