import { HttpErrorResponse } from '@angular/common/http';
// dashboard.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { WorkspaceData, WorkspaceService } from '../workspace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DocumentService, Document } from '../../documents/document.service';
import {
  catchError,
  exhaustMap,
  forkJoin,
  map,
  Subject,
  takeUntil,
  throwError,
} from 'rxjs';

import { showConfirmation } from '../../shared/confirmation.shared';
import { SocketService } from '../../socket/socket.service';
import { Toastr } from '../../shared/toastr.shared';
import { NgxSpinnerService } from 'ngx-spinner';

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
export class WorkspaceDetailComponent implements OnInit, OnDestroy {
  constructor(
    private workspaceService: WorkspaceService,
    private documentService: DocumentService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private cookieService: CookieService,
    private toastr: Toastr,
    private socketService: SocketService,
    private spinner: NgxSpinnerService
  ) {}
  workspaceName: string = 'My Workspace';
  selectedDocument: Partial<Document> | null = null;
  workspaceData: WorkspaceData | null = null;
  activeUsers: User[] | undefined = [];
  documents: Partial<Document>[] | undefined = [];

  currentDate: Date = new Date();

  workspaceId: string | null = '';

  readonlyMode = false;

  private destroy$ = new Subject<void>();

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
    // this.workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');

    // this.getUserByWorkspace(this.workspaceId!);

    // this.getWorkspaceById(this.workspaceId!);

    this.loadWorkspaceData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadWorkspaceData() {
    this.spinner.show();
    this.workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');

    const workspaceUser$ = this.workspaceService
      .getUserByWorkspace(this.workspaceId!)
      .pipe(
        map((res) => res.data),
        map((data) =>
          data.map((val) => ({
            id: val.user.id,
            name: val.user.name,
            email: val.user.email,
            role: val.role,
          }))
        )
      );

    const workspace$ = this.workspaceService
      .getWorkspaceById(this.workspaceId!)
      .pipe(map((res) => res.data));

    forkJoin({
      workspaceUser: workspaceUser$,
      workspace: workspace$,
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ workspaceUser, workspace }) => {
          this.activeUsers = workspaceUser;

          // Workspace Data

          this.workspaceData = workspace;
          this.workspaceName = workspace.name;

          this.documents = this.workspaceData?.document
            .map((doc) => ({
              id: doc.id,
              title: doc.title,
              content: doc.content,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
              isActive: doc.isActive,
            }))
            .filter((doc) => doc.isActive);

          this.spinner.hide();
        },
        error: (err) => {
          console.error('Failed to load workspace:', err);
          this.spinner.hide();
          // this.toastr.showToast('error', 'Failed to load workspace');
        },
      });
  }

  getWorkspaceById(workspaceId: string) {
    this.workspaceService
      .getWorkspaceById(workspaceId!)
      .pipe(
        map((res) => res.data),
        catchError((err) => throwError(() => err)),
        takeUntil(this.destroy$)
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

  // getUserByWorkspace(workspaceId: string) {
  //   this.workspaceService
  //     .getUserByWorkspace(workspaceId)
  //     .pipe(map((res) => res.data))
  //     .subscribe({
  //       next: (data) => {
  //         console.log('Data', data);

  //         this.activeUsers = data.map((val) => ({
  //           id: val.user.id,
  //           name: val.user.name,
  //           email: val.user.email,
  //           role: val.role,
  //         }));
  //       },
  //       error: (err) => console.log(err),
  //     });
  // }

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

    this.socketService
      .getLiveTyping()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
    console.log(this.activeUsers!.some((data) => data.id === token.id));

    return this.activeUsers!.some((data) => data.id === token.id);
  }

  getCurrentUser() {
    const token: any = jwtDecode(this.cookieService.get('jwt'));
    const user = this.activeUsers?.find((user) => user.id === token.id)!;
    console.log({ user });
    return user;
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
        ),
        takeUntil(this.destroy$)
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.socketService.saveDocument(
            this.selectedDocument?.id + '',
            plainText,
            token.id
          );
          this.toastr.showToast('success', 'Document Updated');
          this.getWorkspaceById(this.workspaceId!);
          this.selectedDocument = null;
        },
      });
  }

  removeWorkspace() {
    const workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');

    this.workspaceService
      .removeWorkspace(workspaceId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastr.showToast('success', 'Workspace Removed');
          this.router.navigate(['/workspace']);
        },

        error: (err) => {
          // this.toastr.showToast('error', err);
          console.log(err);
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

    this.workspaceService
      .removeUser(workspaceId!, userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
    this.documentService
      .deleteDocument(documentId, token.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
