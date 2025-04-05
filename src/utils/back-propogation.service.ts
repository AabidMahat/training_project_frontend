import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BackPropogation {
  constructor(private location: Location, private router: Router) {}
  initRedirectOnBack(): void {
    console.log('Back propogation triggered');

    this.location.subscribe(() => {
      this.router.navigate(['/workspace']);
    });
  }
}
