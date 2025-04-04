// time-ago.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date): string {
    if (!value) {
      return '';
    }

    const seconds = Math.floor((new Date().getTime() - value.getTime()) / 1000);

    if (seconds < 60) {
      return 'just now';
    }

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    let counter;
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      counter = Math.floor(seconds / secondsInUnit);
      if (counter > 0) {
        return `${counter} ${unit}${counter === 1 ? '' : 's'} ago`;
      }
    }

    return 'just now';
  }
}
