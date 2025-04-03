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
import { catchError, map, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { QuillEditorComponent } from 'ngx-quill';

import Swal from 'sweetalert2';
import { showConfirmation } from '../../shared/confirmation.shared';

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
    private toastr: ToastrService
  ) {}
  workspaceName: string = 'My Workspace';
  selectedDocument: Partial<Document> | null = null;
  workspaceData: WorkspaceData | null = null;
  activeUsers: User[] | undefined = [];
  documents: Partial<Document>[] | undefined = [];

  @ViewChild('quillEditor') editor!: QuillEditorComponent;

  ngOnInit(): void {
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
    this.isUserPresent();
    const workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');
    console.log('Join workspace clicked');
    this.router.navigate(['/join-workspace', workspaceId]);
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
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          this.toastr.success('Document Fetched');
          this.selectedDocument = data;
        },
      });
  }

  updateDocument() {
    console.log(this.selectedDocument?.content);
    const plainText = this.editor.quillEditor.getText();
    this.documentService
      .updateDocument(this.selectedDocument?.id!, plainText)
      .subscribe({
        next: () =>
          this.toastr.success('Document Updated', '', {
            positionClass: 'toast-top-center',
          }),
      });
  }

  removeWorkspace() {
    const workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');

    this.workspaceService.removeWorkspace(workspaceId!).subscribe({
      next: () => {
        this.toastr.success('Workspace Removed', '', {
          positionClass: 'toast-top-center',
        });
        this.router.navigate(['/workspace']);
      },

      error: (err) => {
        this.toastr.error(err, '', {
          positionClass: 'toast-top-center',
        });
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
        this.toastr.success('User Removed', '', {
          positionClass: 'toast-top-center',
        });
        this.router.navigate(['/workspace']);
      },

      error: (err) => {
        this.toastr.error(err, '', {
          positionClass: 'toast-top-center',
        });
      },
    });
  }
}
