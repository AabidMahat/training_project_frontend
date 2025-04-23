import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
})
export class FormatTime implements PipeTransform {
  transform(value: Date, current: Date): string {
    const difference = current.getTime() - new Date(value).getTime();

    const diffInSeconds = Math.floor(difference / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInSeconds < 60) return 'Just now';
    else if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    else if (diffInHours < 24) return `${diffInHours} hours ago`;
    else if (diffInDays < 7) return `${diffInDays} days ago`;
    else if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    else return `${diffInMonths} months ago`;
  }
}
