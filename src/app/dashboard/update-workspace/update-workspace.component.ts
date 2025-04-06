import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-update-workspace',
  templateUrl: './update-workspace.component.html',
  styleUrls: ['./update-workspace.component.scss'],
})
export class UpdateWorkspaceComponent implements OnInit {
  constructor(
    private workspaceService: WorkspaceService,
    private router: Router
  ) {}

  updateWorkspaceForm = new FormGroup({
    workspaceName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
  });

  ngOnInit(): void {
    this.loadWorkspaceData();
  }

  // Initialize the form with validators

  // Load existing workspace data
  loadWorkspaceData(): void {}

  // Getter for easy access to form controls
  get f() {
    return this.updateWorkspaceForm.controls;
  }

  // Submit form
  onSubmit(): void {}

  // Cancel and go back
  cancel(): void {
    this.router.navigate(['/workspace']);
  }
}
