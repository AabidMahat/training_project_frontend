import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../auth.modal';
import { catchError, map, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  token = '';
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private cookieService: CookieService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  onSubmit() {
    this.authService
      .loginUser(this.loginForm.value as Partial<User>)
      .pipe(
        map((res) => {
          this.token = res.token;
          return res.data;
        }),
        catchError((err) => {
          console.error('Loggin failed:', err);
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (data) => {
          this.toastr.success('Loggin Successful');
          console.log('Loggin Successful:', data);
          console.log(this.token);

          this.cookieService.set('jwt', this.token, 7);
        },
        error: (err) => {
          this.toastr.error('Error while Login');
          console.log('Error:', err);
        },
      });
  }
}
