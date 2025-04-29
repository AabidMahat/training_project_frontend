import { Component, OnInit } from '@angular/core';
import { Document, DocumentService } from '../document.service';
import { catchError, map } from 'rxjs';
import { Toastr } from '../../shared/toastr.shared';
import { SpinnerService } from '../../shared/loader.shared';

@Component({
  selector: 'app-all-documents',
  templateUrl: './all-documents.component.html',
  styleUrl: './all-documents.component.scss',
})
export class AllDocumentsComponent implements OnInit {
  constructor(
    private documentService: DocumentService,
    private toastr: Toastr,
    private spinner: SpinnerService
  ) {}
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.spinner.showSpinner();
    this.documentService
      .getDocuments()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          this.toastr.showToast('success', 'Document fetched Successfully');
          this.spinner.closeSpinner();
          this.documents = data;
          this.filteredDocuments = data;
        },
        error: (err) => {
          console.log(err);
          this.spinner.closeSpinner();
        },
      });
  }

  activateDocument(documentId: number) {
    this.spinner.showSpinner();
    this.documentService.changeStatus(documentId, true).subscribe({
      next: () => {
        this.toastr.showToast('success', 'Document Activated');
        this.spinner.closeSpinner();
        this.loadDocuments();
      },
      error: () => {
        this.spinner.closeSpinner();
      },
    });
  }

  filterDocuments(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDocuments = [...this.documents];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredDocuments = this.documents.filter(
        (doc) =>
          (doc.title && doc.title.toLowerCase().includes(term)) ||
          (doc.user?.name && doc.user.name.toLowerCase().includes(term)) ||
          (doc.workspace?.name &&
            doc.workspace.name.toLowerCase().includes(term)) ||
          doc.id.toString().includes(term)
      );
    }
    this.calculateTotalPages();
    this.currentPage = 1;
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredDocuments.length / 10); // 10 items per page
    if (this.totalPages === 0) this.totalPages = 1;
  }

  getActiveCount(): number {
    return this.documents.filter((doc) => doc.isActive).length;
  }

  getInactiveCount(): number {
    return this.documents.filter((doc) => !doc.isActive).length;
  }

  getUserInitials(name: string | undefined): string {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
}
