import { NgModule } from '@angular/core';
import { ActivityComponent } from './activity.component';
import { ActivityRoutingModule } from './activity.routing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ActivityComponent],
  imports: [ActivityRoutingModule, CommonModule, FormsModule],
  exports: [ActivityComponent],
})
export class ActivityModule {}
