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

  ngOnInit(): void {
    this.activityService
      .getAllActivity()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => this.activities.push(...data),
      });
  }
}
