import { Component, OnInit } from '@angular/core';
import { Request, RequestService } from '../request.service';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-show-request',
  templateUrl: './show-request.component.html',
  styleUrl: './show-request.component.scss',
})
export class ShowRequestComponent implements OnInit {
  constructor(
    private requestService: RequestService,
    private toastr: ToastrService
  ) {}

  requests: Partial<Request>[] = [];

  ngOnInit(): void {
    this.requestService
      .showRequest()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          console.log(data);

          this.requests.push(...data);
        },
      });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  approveRequest(request: any): void {
    this.requestService
      .approveRequest(request.user.id, request.workspace.id)
      .subscribe({
        next: (data) => this.toastr.success(data.message),
      });
    request.status = 'approved';
  }

  rejectRequest(request: any): void {
    request.status = 'rejected';
  }
}
