// document-list.component.ts
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

interface Document {
  id: number;
  title: string | null;
  content: string | null;
  documentUrl: string;
  document: File | null;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-document-list',
  templateUrl: './show-documents.component.html',
  styleUrls: ['./show-documents.component.scss'],
  providers: [DatePipe],
})
export class ShowDocumentComponent implements OnInit {
  documents: Document[] = [];
  selectedDocument: Document | null = null;

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    // Mock data - replace with your actual data fetching logic
    this.documents = [
      {
        id: 1,
        title: 'Annual Report',
        content: 'This document contains the annual financial report for 2024.',
        documentUrl: 'https://example.com/documents/1',
        document: null,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-20'),
      },
      {
        id: 2,
        title: 'Project Proposal',
        content: 'Proposal for the new client project starting in May.',
        documentUrl: 'https://example.com/documents/2',
        document: null,
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date('2024-04-01'),
      },
    ];

    // Select first document by default
    if (this.documents.length > 0) {
      this.selectedDocument = this.documents[0];
    }
  }

  selectDocument(doc: Document): void {
    this.selectedDocument = doc;
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'MMM d, yyyy') || '';
  }
}
