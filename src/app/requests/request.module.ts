import { NgModule } from '@angular/core';
import { ShowRequestComponent } from './show-request/show-request.component';
import { RequestRoutingModule } from './request.routing';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ShowRequestComponent],
  imports: [RequestRoutingModule, CommonModule],
  exports: [ShowRequestComponent],
})
export class RequestModule {}
