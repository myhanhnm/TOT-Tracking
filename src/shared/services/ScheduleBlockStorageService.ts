import { DEFAULT_SCHEDULE_BLOCKS, SCHEDULE_BLOCKS_STORAGE_KEY } from 'src/modules/WorkforceActivity/constants/schedule.constants';
import { ScheduleBlock } from 'src/modules/WorkforceActivity/models/schedule-block.model';

function isValidScheduleBlock(value: unknown): value is ScheduleBlock {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const block = value as Partial<ScheduleBlock>;

  return (
    typeof block.id === 'string' &&
    (block.type === 'PAID_BREAK' || block.type === 'UNPAID_BREAK' || block.type === 'MEETING') &&
    typeof block.label === 'string' &&
    typeof block.startTime === 'string' &&
    typeof block.endTime === 'string' &&
    (block.appliesTo === 'ALL_ASSOCIATES' || block.appliesTo === 'SELECTED_ASSOCIATES')
  );
}

export class ScheduleBlockStorageService {
  static load(): ScheduleBlock[] {
    if (typeof window === 'undefined') {
      return DEFAULT_SCHEDULE_BLOCKS;
    }

    try {
      const stored = window.localStorage.getItem(SCHEDULE_BLOCKS_STORAGE_KEY);

      if (!stored) {
        return DEFAULT_SCHEDULE_BLOCKS;
      }

      const parsed: unknown = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        return DEFAULT_SCHEDULE_BLOCKS;
      }

      const blocks = parsed.filter(isValidScheduleBlock);

      return blocks.length > 0 ? blocks : DEFAULT_SCHEDULE_BLOCKS;
    } catch {
      return DEFAULT_SCHEDULE_BLOCKS;
    }
  }

  static save(blocks: ScheduleBlock[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(SCHEDULE_BLOCKS_STORAGE_KEY, JSON.stringify(blocks));
  }

  static createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
