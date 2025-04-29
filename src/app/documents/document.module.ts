import { WorkspaceModule } from './../dashboard/workspace.module';
import { NgModule } from '@angular/core';
import { AddDocumentComponent } from './add-document/add-document.component';
import { ShowDocumentComponent } from './show-documents/show-documents.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentRoutingModule } from './document.routing';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AllDocumentsComponent } from './all-documents/all-documents.component';
import { AuthModule } from '../auth/auth.module';
@NgModule({
  declarations: [
    AddDocumentComponent,
    ShowDocumentComponent,
    AllDocumentsComponent,
  ],
  exports: [AddDocumentComponent, ShowDocumentComponent],
  imports: [
    CommonModule,
    FormsModule,
    DocumentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
    WorkspaceModule,
    AuthModule,
  ],
})
export class DocumentModule {}
