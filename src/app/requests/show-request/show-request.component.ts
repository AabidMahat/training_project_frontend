import { Component, OnInit } from '@angular/core';
import { Request, RequestService } from '../request.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-access-requests',
  templateUrl: './show-request.component.html',
  styleUrls: ['./show-request.component.scss'],
})
export class AccessRequestsComponent implements OnInit {
  requests: Request[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  page: number = 1;
  limit: number = 5;

  constructor(
    private requestService: RequestService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestService
      .showRequest(this.page, this.limit)
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          // Mark new requests for animation
          const newRequests = data.map((request) => ({
            ...request,
            isNew: true,
          }));

          this.requests = [...newRequests];

          // Remove isNew flag after animation
          setTimeout(() => {
            this.requests = this.requests.map((request) => ({
              ...request,
              isNew: false,
            }));
          }, 1000);
        },
        error: (err) => {
          this.toastr.error('Failed to load requests');
          console.error(err);
        },
      });
  }

  get filteredRequests(): Request[] {
    return this.requests.filter((request) => {
      // Apply search filter
      const searchMatch = this.searchTerm
        ? request.user.name
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          request.user.email
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          request.workspace.name
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        : true;

      // Apply status filter
      const statusMatch =
        this.statusFilter === 'all'
          ? true
          : request.status === this.statusFilter;

      return searchMatch && statusMatch;
    });
  }

  approveRequest(request: Request): void {
    this.requestService
      .approveRequest(+request.user.id, request.workspace.id)
      .subscribe({
        next: (data) => {
          request.status = 'approved';
          this.toastr.success(data.message || 'Request approved successfully');
        },
        error: (err) => {
          this.toastr.error('Failed to approve request');
          console.error(err);
        },
      });
  }

  rejectRequest(request: Request): void {
    this.requestService
      .rejectRequest(request.user.id, request.workspace.id)
      .subscribe({
        next: (data) => {
          request.status = 'rejected';
          this.toastr.success(data.message || 'Request rejected successfully');
        },
        error: (err) => {
          this.toastr.error('Failed to reject request');
          console.error(err);
        },
      });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
