import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceService } from '../workspace.service';
import { catchError, debounceTime, fromEvent, map, throwError } from 'rxjs';
import { Workspace } from '../workspace.modal';
import { Document, DocumentService } from '../../documents/document.service';
import { Toastr } from '../../shared/toastr.shared';
import { AuthService } from '../../auth/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit {
  isSidebarOpen: boolean = false;
  isShowDocument: boolean = false;

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService,
    private documentService: DocumentService,
    private toastr: Toastr,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  filterWorkspaces: Workspace[] = [];

  documents: Document[] = [];

  workspaces: Workspace[] = [];

  @ViewChild('searchQuery', { static: true }) searchQuery!: ElementRef;
  colorPalette: string[] = [
    '#4f46e5', // Indigo
    '#3b82f6', // Blue
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#f97316', // Orange
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#ef4444', // Red
  ];

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  loadWorkspaces(): void {
    this.workspaceService
      .getAllWorkspace()
      .pipe(
        map((res) => res.data),
        catchError((err) => throwError(() => err))
      )
      .subscribe({
        next: (data) => {
          this.workspaces = data;
          this.isShowDocument = false;
          this.filterWorkspaces = this.workspaces;
          console.log('Workspaces loaded:', this.workspaces);
        },
        error: (err) => console.error('Error loading workspaces:', err),
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  searchWorkspaces(): void {
    console.log('Searching for:', this.searchQuery);

    fromEvent(this.searchQuery.nativeElement, 'input')
      .pipe(
        debounceTime(500),
        map((event: any) => event.target.value)
      )
      .subscribe({
        next: (searchQuery: string) => {
          this.filterWorkspaces = this.workspaces.filter((workspace) =>
            workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        },
      });
  }

  goToWorkspaceDetail(workspaceId: string): void {
    this.router.navigate(['/workspace', workspaceId]);
  }

  getWorkspaceColor(id: string): string {
    const index =
      id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      this.colorPalette.length;
    return this.colorPalette[index];
  }

  onCreateWorkspace() {
    this.router.navigate(['/create-workspace']);
  }

  openWorkspace(workspaceId: string) {
    this.router.navigate(['/workspace', workspaceId]);
  }

  getOwnerWorkspace() {
    this.workspaceService
      .getOwnerWorkspace()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          this.isShowDocument = false;
          this.workspaces = data;
        },
      });
  }

  logOut() {
    this.toastr.showToast('success', 'Log out successfully');
    setTimeout(() => {
      this.authService.logOut();
    }, 2000);
  }

  getUserRole() {
    return this.cookieService.get('role');
  }
}
