import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../workspace.service';
import { catchError, map, throwError } from 'rxjs';
import { Workspace } from '../workspace.modal';
import { SocketService } from '../../socket/socket.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit {
  isSidebarOpen: boolean = false;
  searchQuery: string = '';

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService,
    private activateRoute: ActivatedRoute
  ) {}

  workspaces: Workspace[] = [];
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
          console.log('Workspaces loaded:', this.workspaces);
        },
        error: (err) => console.error('Error loading workspaces:', err),
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  searchWorkspaces(): void {
    // Implement search functionality here
    console.log('Searching for:', this.searchQuery);
    // Filter workspaces based on search query
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
        next: (data) => (this.workspaces = data),
      });
  }
}
