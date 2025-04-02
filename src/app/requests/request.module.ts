import { NgModule } from '@angular/core';
import { AccessRequestsComponent } from './show-request/show-request.component';
import { RequestRoutingModule } from './request.routing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AccessRequestsComponent],
  imports: [RequestRoutingModule, CommonModule, FormsModule],
  exports: [AccessRequestsComponent],
})
export class RequestModule {}
