import { NgModule } from '@angular/core';
import { AddDocumentComponent } from './add-document/add-document.component';
import { ShowDocumentComponent } from './show-documents/show-documents.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentRoutingModule } from './document.routing';

@NgModule({
  declarations: [AddDocumentComponent, ShowDocumentComponent],
  exports: [AddDocumentComponent, ShowDocumentComponent],
  imports: [
    CommonModule,
    FormsModule,
    DocumentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class DocumentModule {}
