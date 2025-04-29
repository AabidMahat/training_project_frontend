import { Component, Input } from '@angular/core';
import { Workspace } from '../../workspace.modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspace-item',
  templateUrl: './workspace-item.component.html',
  styleUrl: './workspace-item.component.scss',
})
export class WorkspaceItemComponent {
  constructor(private router: Router) {}
  @Input({
    required: true,
  })
  workspaces!: Workspace[];
  @Input({
    required: true,
  })
  filterWorkspaces!: Workspace[];

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

  getWorkspaceDocumentLength(workspaceId: string) {
    const workspace = this.workspaces.find((data) => data.id === workspaceId);

    return workspace?.document.reduce(
      (acc, curr) => acc + (curr.isActive === true ? 1 : 0),
      0
    );
  }

  goToWorkspaceDetail(workspaceId: string): void {
    this.router.navigate(['/workspace', workspaceId]);
  }

  openWorkspace(workspaceId: string) {
    this.router.navigate(['/workspace', workspaceId]);
  }

  getWorkspaceColor(id: string): string {
    const index =
      id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      this.colorPalette.length;
    return this.colorPalette[index];
  }
}
