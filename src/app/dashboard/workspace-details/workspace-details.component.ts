import { HttpErrorResponse } from '@angular/common/http';
// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { WorkspaceData, WorkspaceService } from '../workspace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DocumentService, Document } from '../../documents/document.service';
import { catchError, map, throwError } from 'rxjs';

import { showConfirmation } from '../../shared/confirmation.shared';
import { SocketService } from '../../socket/socket.service';
import { Toastr } from '../../shared/toastr.shared';

interface User {
  id: number;
  name: string;
  role: string;
  email: string;
}

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace-details.component.html',
  styleUrls: ['./workspace-details.component.scss'],
})
export class WorkspaceDetailComponent implements OnInit {
  constructor(
    private workspaceService: WorkspaceService,
    private documentService: DocumentService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private cookieService: CookieService,
    private toastr: Toastr,
    private socketService: SocketService
  ) {}
  workspaceName: string = 'My Workspace';
  selectedDocument: Partial<Document> | null = null;
  workspaceData: WorkspaceData | null = null;
  activeUsers: User[] | undefined = [];
  documents: Partial<Document>[] | undefined = [];

  workspaceId: string | null = '';

  readonlyMode = false;

  // @ViewChild('quillEditor') editor!: QuillEditorComponent;

  editor: any;

  onEditorCreated(quill: any) {
    this.editor = quill;

    if (this.readonlyMode) {
      this.editor.enable(false);
    }
    this.getRealtimeDocumentUpdate();
  }

  ngOnInit(): void {
    this.workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');

    this.getUserByWorkspace(this.workspaceId!);

    this.getWorkspaceById(this.workspaceId!);
  }

  getWorkspaceById(workspaceId: string) {
    this.workspaceService
      .getWorkspaceById(workspaceId!)
      .pipe(
        map((res) => res.data),
        catchError((err) => throwError(() => err))
      )
      .subscribe({
        next: (data) => {
          this.workspaceData = data;
          this.workspaceName = data.name;
          this.documents = this.workspaceData?.document
            .map((data) => ({
              id: data.id,
              title: data.title,
              content: data.content,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              isActive: data.isActive,
            }))
            .filter((doc) => doc.isActive);
        },
        error: (err) => console.log(err),
      });
  }

  getRealtimeDocumentUpdate() {
    const token: any = jwtDecode(this.cookieService.get('jwt'));
    this.readonlyMode = this.getUserRole() === 'viewer';

    // Emit Changes only if not readonly
    if (!this.readonlyMode) {
      this.editor.on(
        'text-change',
        (delta: any, oldDelta: any, source: string) => {
          if (source === 'user') {
            console.log('User typing', delta);
            this.socketService.typingUpdate(
              this.selectedDocument?.id + '',
              delta,
              token.id
            );
          }
        }
      );
    }

    this.socketService.getLiveTyping().subscribe({
      next: (delta: any) => {
        console.log('Live typing', delta);
        // if (this.editor && !this.editor.hasFocus()) {
        console.log('Focus on editor to update content');
        this.editor.updateContents(delta); // Update without disrupting cursor
        // }
      },
    });
  }

  isUserPresent(): boolean {
    const token: any = jwtDecode(this.cookieService.get('jwt'));
    return this.activeUsers!.some((data) => data.id === token.id);
  }

  getUserByWorkspace(workspaceId: string) {
    this.workspaceService
      .getUserByWorkspace(workspaceId)
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          console.log('Data', data);

          this.activeUsers = data.map((val) => ({
            id: val.user.id,
            name: val.user.name,
            email: val.user.email,
            role: val.role,
          }));
        },
        error: (err) => console.log(err),
      });
  }

  getUserRole() {
    const token: any = jwtDecode(this.cookieService.get('jwt'));

    const user = this.activeUsers?.find((user) => user.id === token.id)!;

    const role = user?.role;

    console.log({ user, role });

    return role?.toLowerCase();
  }

  joinWorkspace(): void {
    const token: any = jwtDecode(this.cookieService.get('jwt'));
    this.isUserPresent();
    const workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');
    console.log('Join workspace clicked');
    this.router.navigate(['/join-workspace', workspaceId]);

    this.socketService.joinWorkspace(this.workspaceData?.id!, token.id);
  }

  addDocument() {
    const workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');

    this.router.navigate(['/add-document', workspaceId]);
  }

  selectDocument(document: Partial<Document>): void {
    this.documentService
      .getDocumentById(document.id!)
      .pipe(
        map((res) => res.data),
        catchError((err: HttpErrorResponse) =>
          throwError(() => new Error(err.error))
        )
      )
      .subscribe({
        next: (data) => {
          const token: any = jwtDecode(this.cookieService.get('jwt'));
          this.socketService.joinDocument(data.id + '', token.id + '');
          this.toastr.showToast('success', 'Document Fetched');
          this.selectedDocument = data;
        },
        error: (err) => {},
      });
  }

  updateDocument() {
    const token: any = jwtDecode(this.cookieService.get('jwt'));
    console.log(this.selectedDocument?.content);
    const plainText = this.editor.getText();

    this.documentService
      .updateDocument(this.selectedDocument?.id!, plainText)
      .subscribe({
        next: () => {
          this.socketService.saveDocument(
            this.selectedDocument?.id + '',
            plainText,
            token.id
          );
          this.toastr.showToast('success', 'Document Updated');
          this.getWorkspaceById(this.workspaceId!);
        },
      });
  }

  removeWorkspace() {
    const workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');

    this.workspaceService.removeWorkspace(workspaceId!).subscribe({
      next: () => {
        this.toastr.showToast('success', 'Workspace Removed');
        this.router.navigate(['/workspace']);
      },

      error: (err) => {
        this.toastr.showToast('error', err);
      },
    });
  }

  showWorkspaceRemoveWindow() {
    showConfirmation(
      'Are you Sure?',
      `Do you want to perform this action`,
      'warning'
    ).then((result) => {
      if (result.isConfirmed) this.removeWorkspace();
      else return;
    });
  }

  showRemoveUserWindow(userId: number) {
    showConfirmation(
      'Are you Sure?',
      `Do you want to perform this action`,
      'warning'
    ).then((result) => {
      if (result.isConfirmed) this.removeUserFromWorkspace(userId);
      else return;
    });
  }

  removeUserFromWorkspace(userId: number) {
    const workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');
    console.log('Clicked');

    this.workspaceService.removeUser(workspaceId!, userId).subscribe({
      next: () => {
        this.toastr.showToast('success', 'User Removed');
        this.router.navigate(['/workspace']);
      },

      error: (err) => {
        this.toastr.showToast('error', err);
      },
    });
  }

  deleteDocument(documentId: number) {
    const token: any = jwtDecode(this.cookieService.get('jwt'));
    this.documentService.deleteDocument(documentId, token.id).subscribe({
      next: (data) => {
        this.toastr.showToast('success', 'Document Deleted Successfully');
        this.getWorkspaceById(this.workspaceId!);
      },
    });
  }

  updateWorkspace() {
    this.router.navigate(['/update-workspace', this.workspaceId]);
  }
}
