import { NgModule } from '@angular/core';
import { UsersComponent } from './users.component';
import { UserRouting } from './user.routing';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [UsersComponent],
  imports: [UserRouting, CommonModule],
  exports: [UsersComponent],
})
export class UserModule {}
