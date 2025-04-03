// login.component.ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, catchError, throwError } from 'rxjs';
import { User } from '../auth.modal';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Toastr } from '../../shared/toastr.shared';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private toastr: Toastr,
    private cookieService: CookieService,
    private router: Router
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService
        .loginUser(this.loginForm.value as Partial<User>)
        .pipe(
          catchError((err) => {
            console.error('Login failed:', err);
            return throwError(() => err);
          })
        )
        .subscribe({
          next: (data) => {
            this.cookieService.set('jwt', data.token);

            this.toastr.showToast('success', 'Login Successful');
            this.router.navigate(['/workspace']);

            console.log('Login Successful:', data);
          },
          error: (err: HttpErrorResponse) => {
            this.toastr.showToast('error', 'Incorrect Email Or Password');
            console.log('Error:', err.error);
          },
        });
    }
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
