import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Toastr } from '../../shared/toastr.shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent {
  constructor(
    private authService: AuthService,
    private toastr: Toastr,
    private router: Router
  ) {}
  otpFormGroup = new FormGroup({
    otp: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    this.authService
      .verifyAccount(this.otpFormGroup.controls.otp.value!)
      .subscribe({
        next: (data) => {
          this.toastr.showToast('success', 'Otp Verifed Successfully');
          this.router.navigate(['/loginUser']);
        },
      });
  }
}
