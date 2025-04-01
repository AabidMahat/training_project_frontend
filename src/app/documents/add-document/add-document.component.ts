import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrl: './add-document.component.scss',
})
export class AddDocumentComponent {
  constructor(
    private activateRoute: ActivatedRoute,
    private documentService: DocumentService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  selectedFile: File | null = null;

  addDocumentForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    const workspaceId = this.activateRoute.snapshot.paramMap.get('workspaceId');

    if (!this.addDocumentForm.valid) {
      return;
    }

    const formData = new FormData();
    formData.append('title', this.addDocumentForm.value.title!);
    formData.append('content', this.addDocumentForm.value.content!);
    formData.append('file', this.selectedFile!);

    console.log(this.selectedFile);

    this.documentService
      .addDocumentToWorkspace(workspaceId!, formData!)
      .subscribe({
        next: (data) => {
          this.toastr.success('Document Added');
          this.router.navigate(['workspace', workspaceId]);
        },
        error: (err) => {
          this.toastr.error('Error while Adding document');
          console.log(err);
        },
      });
  }
}
