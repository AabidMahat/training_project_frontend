import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Activity, ActivityService } from './activity.service';
import { from, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
})
export class ActivityComponent implements OnInit {
  constructor(private activityService: ActivityService) {}

  activities: Activity[] = [];
  filteredActivities: Activity[] = [];

  // Filters

  searchTerm: string = '';
  actionFilter: string = 'all';
  startDate: string = '';
  endDate: string = '';

  page: number = 1;
  limit: number = 8;

  @ViewChild('searchQuery', { static: true }) searchQuery!: ElementRef;
  @ViewChild('actionQuery', { static: true }) actionQuery!: ElementRef;

  // Pagination

  ngOnInit(): void {
    this.loadActivities();
    this.applyFilters();
    this.applyActionFilter();
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.endDate = this.formatDate(today);
    this.startDate = this.formatDate(thirtyDaysAgo);
  }

  loadActivities(): void {
    this.activityService
      .getAllActivity()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          this.activities = data;
          this.filteredActivities = this.activities;
          this.applyFilters();
        },
        error: (error) => {
          console.error('Failed to load activities', error);
        },
      });
  }

  applyFilters(): void {
    fromEvent(this.searchQuery.nativeElement, 'input')
      .pipe(map((event: any) => event.target.value))
      .subscribe({
        next: (value) => {
          this.filteredActivities = this.activities.filter((activity) => {
            const data =
              (activity.action &&
                activity.action.toLowerCase().includes(value.toLowerCase())) ||
              (activity.user.name &&
                activity.user.name
                  .toLowerCase()
                  .includes(value.toLowerCase())) ||
              (activity.document &&
                activity.document.title
                  .toLowerCase()
                  .includes(value.toLowerCase())) ||
              (activity.workspace &&
                activity.workspace.name
                  .toLowerCase()
                  .includes(value.toLowerCase()));

            return data;
          });
        },
      });

    // Reset pagination when filters change
    this.page = 1;
  }

  applyActionFilter(): void {
    fromEvent(this.actionQuery.nativeElement, 'change')
      .pipe(map((event: any) => event.target.value))
      .subscribe({
        next: (value) => {
          console.log(this.filteredActivities);

          this.filteredActivities = this.activities.filter((activity) => {
            if (value.toLowerCase().includes('all')) {
              return true;
            }
            const data = activity.action
              .toLowerCase()
              .includes(value.toLowerCase().split(' ')[0]);

            return data;
          });
        },
      });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.actionFilter = 'all';

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.endDate = this.formatDate(today);
    this.startDate = this.formatDate(thirtyDaysAgo);

    this.applyFilters();
  }

  // Format date for input[type="date"]
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper to get class based on action type
  getActionClass(action: string): string {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) return 'action-create';
    if (actionLower.includes('update') || actionLower.includes('edit'))
      return 'action-update';
    if (actionLower.includes('delete')) return 'action-delete';
    if (actionLower.includes('save')) return 'action-view';
    if (actionLower.includes('add')) return 'action-share';
    return '';
  }

  // Get user initials from name
  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Pagination helpers
  get paginatedActivities(): Activity[] {
    const startIndex = (this.page - 1) * this.limit;
    return this.filteredActivities.slice(startIndex, startIndex + this.limit);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredActivities.length / this.limit);
  }

  get paginationStart(): number {
    return (this.page - 1) * this.limit + 1;
  }

  get paginationEnd(): number {
    const end = this.page * this.limit;
    return end > this.filteredActivities.length
      ? this.filteredActivities.length
      : end;
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }
}
