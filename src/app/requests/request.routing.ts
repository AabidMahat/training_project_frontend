import { RouterModule, Routes } from '@angular/router';
import { ShowRequestComponent } from './show-request/show-request.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'showRequest',
    component: ShowRequestComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRoutingModule {}
