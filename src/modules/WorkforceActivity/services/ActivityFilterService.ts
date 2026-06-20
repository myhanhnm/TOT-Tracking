import { format } from 'date-fns';

import { ActivityFilterOptions, ActivityFilters } from '../models/activity-filters.model';
import { ScanEvent } from '../models/scan-event.model';

function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

export class ActivityFilterService {
  static applyFilters(events: ScanEvent[], filters: ActivityFilters): ScanEvent[] {
    const searchQuery = filters.search.trim().toLowerCase();

    return events.filter((event) => {
      if (filters.date && toDateKey(event.eventTime) !== filters.date) {
        return false;
      }

      if (filters.associateName && event.associateName !== filters.associateName) {
        return false;
      }

      if (filters.loginId && event.loginId !== filters.loginId) {
        return false;
      }

      if (filters.function && event.function !== filters.function) {
        return false;
      }

      if (filters.process && event.process !== filters.process) {
        return false;
      }

      if (filters.unitClass && event.unitClass !== filters.unitClass) {
        return false;
      }

      if (searchQuery) {
        const matchesName = event.associateName.toLowerCase().includes(searchQuery);
        const matchesLogin = event.loginId.toLowerCase().includes(searchQuery);

        if (!matchesName && !matchesLogin) {
          return false;
        }
      }

      return true;
    });
  }

  static extractFilterOptions(events: ScanEvent[]): ActivityFilterOptions {
    return {
      dates: uniqueSorted(events.map((event) => toDateKey(event.eventTime))),
      associateNames: uniqueSorted(events.map((event) => event.associateName)),
      loginIds: uniqueSorted(events.map((event) => event.loginId)),
      functions: uniqueSorted(events.map((event) => event.function).filter(Boolean)),
      processes: uniqueSorted(events.map((event) => event.process).filter(Boolean)),
      unitClasses: uniqueSorted(events.map((event) => event.unitClass).filter(Boolean)),
    };
  }

  static hasActiveFilters(filters: ActivityFilters): boolean {
    return (
      filters.date !== null ||
      filters.associateName !== '' ||
      filters.loginId !== '' ||
      filters.function !== '' ||
      filters.process !== '' ||
      filters.unitClass !== '' ||
      filters.search.trim() !== ''
    );
  }
}
