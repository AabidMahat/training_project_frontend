import { debounceTime } from 'rxjs';
// document-list.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Document, DocumentService } from '../document.service';
import { fromEvent, map } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-document-list',
  templateUrl: './show-documents.component.html',
  styleUrls: ['./show-documents.component.scss'],
  providers: [DatePipe],
})
export class ShowDocumentComponent implements OnInit {
  documents: Document[] = [];
  filterDocument: Document[] = [];
  selectedDocument: Document | null = null;

  constructor(
    private datePipe: DatePipe,
    private documentService: DocumentService,
    private cookieService: CookieService
  ) {}

  @ViewChild('searchDocument', { static: true }) seachDocument!: ElementRef;

  ngOnInit(): void {
    this.documentService
      .getOwnerDocument(this.getUserId())
      .pipe()
      .subscribe({
        next: (data) => {
          console.log(data);

          this.documents = data.data;
          this.filterDocument = this.documents;
        },
      });
    this.searchDocumentData();
  }

  selectDocument(doc: Document): void {
    this.selectedDocument = doc;
  }

  getUserId(): any {
    const token = this.cookieService.get('jwt');
    const tokenData: any = jwtDecode(token);
    return tokenData.id;
  }
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'MMM d, yyyy') || '';
  }

  getDocumentUrl(documentUrl: string) {
    return (
      'http://localhost:3000/uploads/' +
      documentUrl.replace(/\\/g, '/').split('/uploads/')[1]
    );
  }

  searchDocumentData() {
    fromEvent(this.seachDocument.nativeElement, 'input')
      .pipe(
        debounceTime(300),
        map((event: any) => event.target.value)
      )
      .subscribe({
        next: (search: string) => {
          console.log(search);

          this.filterDocument = this.documents.filter((document) =>
            document.title?.toLowerCase()?.includes(search.toLowerCase())
          );
        },
      });
  }
}
