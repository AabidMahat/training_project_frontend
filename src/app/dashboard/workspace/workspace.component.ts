import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceService } from '../workspace.service';
import {
  catchError,
  debounceTime,
  fromEvent,
  map,
  shareReplay,
  Subject,
  takeUntil,
  throwError,
} from 'rxjs';
import { Workspace } from '../workspace.modal';
import { Document } from '../../documents/document.service';
import { Toastr } from '../../shared/toastr.shared';
import { AuthService } from '../../auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  isSidebarOpen: boolean = false;

  destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService,
    private toastr: Toastr,
    private authService: AuthService,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWorkspaces(): void {
    this.spinner.show();
    this.workspaceService
      .getAllWorkspace()
      .pipe(
        map((res) => res.data),
        shareReplay(1),
        catchError((err) => throwError(() => err)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.workspaces = data.filter((item) => !item.isPrivate);
          this.filterWorkspaces = this.workspaces;
          this.spinner.hide();
          console.log('Workspaces loaded:', this.workspaces);
        },
        error: (err) => {
          this.spinner.hide();
          console.error('Error loading workspaces:', err);
        },
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getWorkspaceDocumentLength(workspaceId: string) {
    const workspace = this.workspaces.find((data) => data.id === workspaceId);

    return workspace?.document.reduce(
      (acc, curr) => acc + (curr.isActive === true ? 1 : 0),
      0
    );
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
      .pipe(
        map((res) => res.data),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          console.log({
            owner: data,
          });
          this.filterWorkspaces = data;
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
