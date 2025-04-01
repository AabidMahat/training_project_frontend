import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkspaceService } from '../workspace.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-join-workspace',
  templateUrl: './join-workspace.component.html',
  styleUrl: './join-workspace.component.scss',
})
export class JoinWorkspaceComponent {
  constructor(
    private workService: WorkspaceService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}
  joinWorkspaceForm = new FormGroup({
    workspaceName: new FormControl(''),
    requestType: new FormControl('', [Validators.required]),
    requestedRole: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    const workspaceId = this.route.snapshot.paramMap.get('workspaceId');
    this.workService
      .joinWorkspace(workspaceId!, {
        name: this.joinWorkspaceForm.get('workspaceName')!.value,
        request_type: this.joinWorkspaceForm.get('requestType')!.value,
        requested_role: this.joinWorkspaceForm.get('requestedRole')!.value,
      })
      .subscribe({
        next: (data) => {
          this.toastr.success('Admin will Approve Your Request');
        },
        error: (err) => {
          this.toastr.error('Failed to join workspace');
        },
      });
  }
}
