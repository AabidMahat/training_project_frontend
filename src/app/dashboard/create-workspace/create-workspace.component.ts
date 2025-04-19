import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { WorkspaceService } from '../workspace.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.scss'],
})
export class CreateWorkspaceComponent implements OnInit {
  @Output() formClosed = new EventEmitter<void>();

  isFormVisible = true;
  previewColor = '#4f46e5';

  constructor(
    private workspaceService: WorkspaceService,
    private router: Router
  ) {}

  createWorkspaceForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    isPrivate: new FormControl(false, [Validators.required]),
  });

  ngOnInit(): void {}

  // Show the form
  showForm(): void {
    this.isFormVisible = true;
    // Reset form when opening
    this.createWorkspaceForm.reset();
  }

  // Hide the form
  hideForm(): void {
    this.isFormVisible = false;
    this.formClosed.emit();
    this.router.navigate(['/workspace']);
  }

  get name() {
    return this.createWorkspaceForm.get('name')!;
  }

  // Submit the form
  onSubmit(): void {
    if (this.createWorkspaceForm.valid) {
      this.workspaceService
        .createWorkspace(
          this.createWorkspaceForm.get('name')?.value!,
          this.createWorkspaceForm.controls.isPrivate.value!
        )
        .subscribe({
          next: (response) => {
            this.hideForm();
          },
          error: (error) => {
            console.error('Error creating workspace:', error);
          },
        });
    }
  }
}
