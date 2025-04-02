import { NgModule } from '@angular/core';
import { ActivityComponent } from './activity.component';
import { ActivityRoutingModule } from './activity.routing';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ActivityComponent],
  imports: [ActivityRoutingModule, CommonModule],
  exports: [ActivityComponent],
})
export class ActivityModule {}
