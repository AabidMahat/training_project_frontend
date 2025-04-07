import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../workspace.service';
import { map } from 'rxjs';
import { Toastr } from '../../shared/toastr.shared';

@Component({
  selector: 'app-update-workspace',
  templateUrl: './update-workspace.component.html',
  styleUrls: ['./update-workspace.component.scss'],
})
export class UpdateWorkspaceComponent implements OnInit {
  constructor(
    private workspaceService: WorkspaceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: Toastr
  ) {}

  workspaceId: string = '';

  ngOnInit(): void {
    this.workspaceId =
      this.activatedRoute.snapshot.paramMap.get('workspaceId')!;
    this.loadWorkspaceData(this.workspaceId!);
  }

  updateWorkspaceForm = new FormGroup({
    workspaceName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  loadWorkspaceData(workspaceId: string): void {
    this.workspaceService
      .getWorkspaceById(workspaceId)
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          this.updateWorkspaceForm.controls.workspaceName.setValue(data.name);
        },
      });
  }

  get f() {
    return this.updateWorkspaceForm.controls;
  }

  onSubmit(): void {
    this.workspaceService
      .updateWorkspace(
        this.workspaceId,
        this.updateWorkspaceForm.controls.workspaceName.value!
      )
      .subscribe({
        next: (data) => {
          this.toastr.showToast('success', 'Data upated successfully');
          this.router.navigate(['/workspace']);
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/workspace']);
  }
}
