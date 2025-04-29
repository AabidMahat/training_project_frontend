import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AddDocumentComponent } from './add-document/add-document.component';
import { ShowDocumentComponent } from './show-documents/show-documents.component';
import { AllDocumentsComponent } from './all-documents/all-documents.component';

const routes: Routes = [
  {
    path: 'add-document/:workspaceId',
    canActivate: [AuthGuard],

    component: AddDocumentComponent,
  },
  {
    path: 'show-documents',
    canActivate: [AuthGuard],
    component: ShowDocumentComponent,
  },
  {
    path: 'all-documents',
    canActivate: [AuthGuard],
    component: AllDocumentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentRoutingModule {}
