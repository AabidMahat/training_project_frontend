import { RouterModule, Routes } from '@angular/router';
import { AccessRequestsComponent } from './show-request/show-request.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'showRequest',
    component: AccessRequestsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRoutingModule {}
