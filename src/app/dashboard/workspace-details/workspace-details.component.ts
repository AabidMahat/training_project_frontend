// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { WorkspaceData, WorkspaceService } from '../workspace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DocumentService, Document } from '../../documents/document.service';
import { catchError, map, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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

  ngOnInit(): void {
    const workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');

    this.workspaceService
      .getWorkspaceById(workspaceId!)
      .pipe(
        map((res) => res.data),
        catchError((err) => throwError(() => err))
      )
      .subscribe({
        next: (data) => {
          this.workspaceData = data;

          this.activeUsers = this.workspaceData?.workspaceUser.map((data) => ({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          }));

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
}
