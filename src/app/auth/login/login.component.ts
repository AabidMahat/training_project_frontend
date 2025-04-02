// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, catchError, throwError } from 'rxjs';
import { User } from '../auth.modal';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      this.authService
        .loginUser(this.loginForm.value as Partial<User>)
        .pipe(
          map((res: any) => res.data),
          catchError((err) => {
            console.error('Login failed:', err);
            return throwError(() => err);
          })
        )
        .subscribe({
          next: (data: any) => {
            this.toastr.success('Login Successful', '', {
              positionClass: 'toast-top-center',
            });
            console.log('Login Successful:', data);
          },
          error: (err: any) => {
            this.toastr.error('Error in login');
            console.log('Error:', err);
          },
        });
      // Add your authentication logic here
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        control!.markAsTouched();
      });
    }
  }

  // Helper getter methods for form controls
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
