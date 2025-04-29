import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  constructor(private spinnerService: NgxSpinnerService) {}

  showSpinner() {
    this.spinnerService.show();
  }

  closeSpinner() {
    this.spinnerService.hide();
  }
}
