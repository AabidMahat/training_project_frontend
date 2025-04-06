import { Injectable, NgZone } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket, private zone: NgZone) {}

  private delta$ = new BehaviorSubject<any>(null);

  joinWorkspace(workspaceId: string, userId: string) {
    this.socket.emit('joinWorkspace', { workspaceId, userId });
  }

  joinDocument(documentId: string, userId: string) {
    this.socket.emit('joinDocument', { documentId, userId });
  }

  typingUpdate(documentId: string, content: string, userId: string) {
    this.socket.emit('typingUpdate', { documentId, content, userId });
  }

  saveDocument(documentId: string, content: string, userId: string) {
    this.socket.emit('saveDocument', { documentId, content, userId });
  }

  getLiveTyping() {
    return new Observable((observer) => {
      this.socket.on('liveTyping', (data: any) => {
        console.log('Live typing data', data);
        this.zone.run(() => {
          observer.next(data);
        });
      });
    });
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
