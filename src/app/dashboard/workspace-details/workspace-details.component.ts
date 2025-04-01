// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { WorkspaceData, WorkspaceService } from '../workspace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

interface User {
  id: number;
  name: string;
  role: string;
  email: string;
}

interface Document {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './workspace-details.component.html',
  styleUrls: ['./workspace-details.component.scss'],
})
export class DashboardDetailComponent implements OnInit {
  constructor(
    private workspaceService: WorkspaceService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private cookieService: CookieService
  ) {}
  workspaceName: string = 'My Workspace';

  selectedDocument: Document | null = null;

  workspaceData: WorkspaceData | null = null;

  activeUsers: User[] | undefined = [];

  documents: Document[] | undefined = [];

  ngOnInit(): void {
    this.workspaceService.workspaceData$.subscribe({
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

  selectDocument(document: Document): void {
    this.selectedDocument = document;
  }
}
