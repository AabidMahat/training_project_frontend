import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Toastr } from '../../shared/toastr.shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resend-otp',
  templateUrl: './resend-otp.component.html',
  styleUrl: './resend-otp.component.scss',
})
export class ResendOtpComponent {
  @Output() closeOtpForm = new EventEmitter();

  constructor(
    private authService: AuthService,
    private toastr: Toastr,
    private router: Router
  ) {}

  resendOtpform = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get formControls() {
    return this.resendOtpform.controls;
  }

  onSubmit() {
    this.authService
      .resendOtp(this.resendOtpform.controls.email.value!)
      .subscribe({
        next: () => {
          this.toastr.showToast('success', 'Resend Otp to mail');
          this.router.navigate(['/verify-account']);
        },
      });
  }

  closeModal() {
    this.closeOtpForm.emit();
  }
}
