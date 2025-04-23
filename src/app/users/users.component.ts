import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserData, UserService } from './user.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Toastr } from '../shared/toastr.shared';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  users: Partial<UserData>[] = [];
  filteredUsers: Partial<UserData>[] = [];
  isLoading: boolean = false;
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  dateSortDirection: 'asc' | 'desc' = 'desc';

  @ViewChild('searchQuery', {
    static: true,
    read: ElementRef,
  })
  searchQuery!: ElementRef;

  constructor(private userService: UserService, private toastr: Toastr) {}

  ngOnInit(): void {
    this.loadUsers();
    this.onSearch();

    this.filterByStatus(this.statusFilter);
  }

  loadUsers() {
    this.isLoading = true;
    this.userService
      .getAllUsers()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          data = data.filter((item) => item.role !== 'admin');
          this.users = data;
          this.filteredUsers = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.isLoading = false;
        },
      });
  }

  onSearch() {
    fromEvent(this.searchQuery.nativeElement, 'input')
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe({
        next: (event: any) => {
          const val: string = event.target.value.toLowerCase();
          this.filteredUsers = this.users.filter((data) => {
            return (
              data.name?.toLowerCase().includes(val) ||
              data.email?.includes(val)
            );
          });
        },
      });
  }

  filterByStatus(status: 'all' | 'active' | 'inactive') {
    this.statusFilter = status;

    if (status === 'active') {
      this.filteredUsers = this.users.filter((data) => data.isActive);
    } else if (status === 'inactive') {
      this.filteredUsers = this.users.filter((data) => !data.isActive);
    } else {
      this.filteredUsers = this.users;
    }
  }

  toggleUserStatus(user: Partial<UserData>) {
    if (user.id) {
      this.isLoading = true;
      const updatedStatus = !user.isActive;

      this.userService
        .changeUserStatus(user.id, updatedStatus)
        .pipe(map((res) => res.message))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.toastr.showToast('success', 'Data Chnaged Successfully');
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error updating user status:', err);
            this.isLoading = false;
          },
        });
    }
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'UN';

    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    const firstName = nameParts[0].charAt(0);
    const lastName = nameParts[nameParts.length - 1].charAt(0);

    return (firstName + lastName).toUpperCase();
  }
}
