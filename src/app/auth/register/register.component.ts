import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { catchError, map, throwError } from 'rxjs';
import { User } from '../auth.modal';
import { ToastrService } from 'ngx-toastr';

function passwordMatch(
  controls: AbstractControl
): { [key: string]: boolean } | null {
  const password = controls.get('password')?.value;
  const confirmPassword = controls.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  registrationForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      role: new FormControl('', [Validators.required]),
    },
    {
      validators: passwordMatch,
    }
  );

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.authService
        .registerUser(this.registrationForm.value as Partial<User>)
        .pipe(
          map((res) => res.data),
          catchError((err) => {
            console.error('Registration failed:', err);
            return throwError(() => err);
          })
        )
        .subscribe({
          next: (data) => {
            this.toastr.success('Registration Successful');
            console.log('Registration Successful:', data);
          },
          error: (err) => {
            this.toastr.error('Error in Registration');
            console.log('Error:', err);
          },
        });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registrationForm.controls).forEach((key) => {
        const control = this.registrationForm.get(key);
        control!.markAsTouched();
      });
    }
  }

  // Helper getter methods for form controls
  get name() {
    return this.registrationForm.get('name');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('password');
  }
  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }
  get role() {
    return this.registrationForm.get('role');
  }
}
