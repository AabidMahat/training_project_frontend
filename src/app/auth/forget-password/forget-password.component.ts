// forgot-password.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Toastr } from '../../shared/toastr.shared';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {
  @Output() closeForgotPasswordModal = new EventEmitter();

  constructor(private authService: AuthService, private toastr: Toastr) {}

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get formControls() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.authService.forgotPassword(this.formControls.email.value!).subscribe({
      next: (data) => {
        this.toastr.showToast(
          'success',
          'Password reset link sent to your email'
        );
        this.closeForgotPasswordModal.emit();
      },
    });
  }

  closeModal() {
    this.forgotPasswordForm.reset();

    this.closeForgotPasswordModal.emit();
  }
}
