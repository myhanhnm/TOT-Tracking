import { ScheduleBlock } from '../models/schedule-block.model';

export const SCHEDULE_BLOCKS_STORAGE_KEY = 'workforce-activity-schedule-blocks';

export const DEFAULT_SCHEDULE_BLOCKS: ScheduleBlock[] = [
  {
    id: 'default-meeting',
    type: 'MEETING',
    label: 'Fast Start / SOS',
    startTime: '07:30',
    endTime: '07:40',
    appliesTo: 'ALL_ASSOCIATES',
  },
  {
    id: 'default-paid-break-1',
    type: 'PAID_BREAK',
    label: 'Paid Break 1',
    startTime: '10:15',
    endTime: '10:30',
    appliesTo: 'ALL_ASSOCIATES',
  },
  {
    id: 'default-lunch',
    type: 'UNPAID_BREAK',
    label: 'Lunch',
    startTime: '12:30',
    endTime: '13:00',
    appliesTo: 'ALL_ASSOCIATES',
  },
  {
    id: 'default-paid-break-2',
    type: 'PAID_BREAK',
    label: 'Paid Break 2',
    startTime: '15:15',
    endTime: '15:30',
    appliesTo: 'ALL_ASSOCIATES',
  },
];
