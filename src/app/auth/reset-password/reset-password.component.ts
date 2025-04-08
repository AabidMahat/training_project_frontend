// reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Toastr } from '../../shared/toastr.shared';

function passwordMatchValidator(controls: AbstractControl): {
  [key: string]: boolean;
} | null {
  const password = controls.get('newPassword')?.value;
  const confirmPassword = controls.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    controls.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }

  return null;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  isSubmitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activate: ActivatedRoute,
    private toastr: Toastr
  ) {}

  resetPasswordForm = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    },
    {
      validators: passwordMatchValidator,
    }
  );

  ngOnInit(): void {
    // You could retrieve a token from the URL here if needed
  }

  get formControls() {
    return this.resetPasswordForm.controls;
  }

  onSubmit() {
    const resetToken = this.activate.snapshot.paramMap.get('resetToken');

    this.isSubmitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.authService
      .resetPassword(
        resetToken!,
        this.formControls.newPassword.value!,
        this.formControls.confirmPassword.value!
      )
      .subscribe({
        next: (data) => {
          this.toastr.showToast('success', 'Password reset successfully');
          this.router.navigate(['/loginUser']);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  closeModal() {
    this.router.navigate(['/loginUser']);
  }
}
