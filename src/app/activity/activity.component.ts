import { Component, OnInit } from '@angular/core';
import { Activity, ActivityService } from './activity.service';
import { map } from 'rxjs';

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

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  ngOnInit(): void {
    this.loadActivities();

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
          this.applyFilters();
        },
        error: (error) => {
          console.error('Failed to load activities', error);
        },
      });
  }

  applyFilters(): void {
    this.filteredActivities = this.activities.filter((activity) => {
      // Apply search filter
      const searchMatch =
        !this.searchTerm ||
        activity.id.toString().includes(this.searchTerm) ||
        activity.action.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        activity.user.name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        (activity.document &&
          activity.document.title
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())) ||
        (activity.workspace &&
          activity.workspace.name
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()));

      // Apply action filter
      const actionMatch =
        this.actionFilter === 'all' ||
        activity.action.toLowerCase() === this.actionFilter.toLowerCase();

      // Apply date filter
      const activityDate = new Date(activity.timestamp);
      let dateMatch = true;

      if (this.startDate) {
        const startDate = new Date(this.startDate);
        dateMatch = dateMatch && activityDate >= startDate;
      }

      if (this.endDate) {
        const endDate = new Date(this.endDate);
        // Set time to end of day
        endDate.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && activityDate <= endDate;
      }

      return searchMatch && actionMatch && dateMatch;
    });

    // Reset pagination when filters change
    this.currentPage = 1;
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
    if (actionLower.includes('view')) return 'action-view';
    if (actionLower.includes('share')) return 'action-share';
    return '';
  }

  // Helper to get icon based on action type
  getActionIcon(action: string): string {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) return 'fas fa-plus';
    if (actionLower.includes('update') || actionLower.includes('edit'))
      return 'fas fa-edit';
    if (actionLower.includes('delete')) return 'fas fa-trash';
    if (actionLower.includes('view')) return 'fas fa-eye';
    if (actionLower.includes('share')) return 'fas fa-share-alt';
    return 'fas fa-cog';
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
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredActivities.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredActivities.length / this.itemsPerPage);
  }

  get paginationStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get paginationEnd(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredActivities.length
      ? this.filteredActivities.length
      : end;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
