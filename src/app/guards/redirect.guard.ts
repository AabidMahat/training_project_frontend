import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class RedirectAuthGuard implements Resolve<boolean> {
  constructor(private cookieService: CookieService, private router: Router) {}

  resolve(): boolean {
    const token = this.cookieService.get('jwt');
    console.log(token);
    if (token) {
      try {
        const tokenData: JwtPayload = jwtDecode(token);

        if (tokenData) this.router.navigate(['/workspace']);
        return true;
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
    return true;
  }
}
