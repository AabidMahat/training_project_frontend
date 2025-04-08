import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class Toastr {
  constructor(private toastr: ToastrService) {}

  showToast(type: string, message: string) {
    switch (type.toLowerCase()) {
      case 'success': {
        this.toastr.success(message, '', {
          positionClass: 'toast-top-center',
          closeButton: true,
          onActivateTick: true,
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing',
          tapToDismiss: true,
          enableHtml: true,
          newestOnTop: true,
        });
        break;
      }
      case 'error': {
        this.toastr.error(message, '', {
          positionClass: 'toast-top-center',
          closeButton: true,
          onActivateTick: true,
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing',
          tapToDismiss: true,
          enableHtml: true,
          newestOnTop: true,
        });
        break;
      }
    }
  }
}
