import { HttpErrorResponse } from '@angular/common/http';
import { Workspace } from './../workspace.modal';
// dashboard.component.ts
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { WorkspaceData, WorkspaceService } from '../workspace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DocumentService, Document } from '../../documents/document.service';
import { catchError, debounceTime, fromEvent, map, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { QuillEditorComponent } from 'ngx-quill';

import Swal from 'sweetalert2';
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

  @ViewChild('quillEditor') editor!: QuillEditorComponent;

  ngOnInit(): void {

    this.getRealtimeDocumentUpdate();
    const workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');

    this.getUserByWorkspace(workspaceId!);

    this.workspaceService
      .getWorkspaceById(workspaceId!)
      .pipe(
        map((res) => res.data),
        catchError((err) => throwError(() => err))
      )
      .subscribe({
        next: (data) => {
          this.workspaceData = data;

          this.documents = this.workspaceData?.document.map((data) => ({
            id: data.id,
            title: data.title,
            content: data.content,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          }));
        },
        error: (err) => console.log(err),
      });
  }

  getRealtimeDocumentUpdate() {
    this.socketService.getDocumentUpdates().subscribe({
      next: (updates: any) => {
        if (
          this.selectedDocument &&
          this.selectedDocument.id === updates.documentId
        ) {
          console.log(updates);

          this.selectedDocument.content = updates.content;
        }

        const index = this.documents?.findIndex(
          (doc) => doc.id === updates.documentId
        ) as number;

        if (index !== -1) {
          this.documents![index].content = updates.content;
        }
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

    const role: string = this.activeUsers?.find((user) => user.id === token.id)
      ?.role!;

    return role;
  }

  joinWorkspace(): void {
    const token: any = jwtDecode(this.cookieService.get('jwt'));
    this.isUserPresent();
    const workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');
    console.log('Join workspace clicked');
    this.router.navigate(['/join-workspace', workspaceId]);

    this.socketService.joinWorkspace(this.workspaceData?.id!, token.id);
    // Implement joining workspace functionality
  }

  addDocument() {
    const workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');

    this.router.navigate(['/add-document', workspaceId]);
  }

  selectDocument(document: Partial<Document>): void {
    // this.selectedDocument = { ...document };
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
          this.toastr.showToast('success', 'Document Fetched');
          this.selectedDocument = data;
        },
        error: (err) => {},
      });
  }




  updateDocument() {
    const token: any = jwtDecode(this.cookieService.get('jwt'));
    console.log(this.selectedDocument?.content);
    const plainText = this.editor.quillEditor.getText();


    fromEvent(this.editor,'input').pipe(debounceTime(200)).subscribe({
      
    })

    this.documentService
      .updateDocument(this.selectedDocument?.id!, plainText)
      .subscribe({
        next: () => {
          this.socketService.editDocument(
            this.selectedDocument?.id + '',
            plainText,
            token.id
          );
          this.toastr.showToast('success', 'Document Updated');
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
}
