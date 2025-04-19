import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkspaceService } from '../workspace.service';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-join-workspace',
  templateUrl: './join-workspace.component.html',
  styleUrl: './join-workspace.component.scss',
})
export class JoinWorkspaceComponent implements OnInit {
  constructor(
    private workService: WorkspaceService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}
  joinWorkspaceForm = new FormGroup({
    workspaceName: new FormControl(''),
    requestType: new FormControl('', [Validators.required]),
    requestedRole: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data: any) => {
        console.log(data);
        this.joinWorkspaceForm.controls.workspaceName.setValue(
          data['workspaceName']
        );
      },
    });
    // this.joinWorkspaceForm.controls.workspaceName.setValue()
  }
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
          this.router.navigate(['/workspace']);
        },
        error: (err) => {
          this.toastr.error('Failed to join workspace');
        },
      });
  }
}
