import {
  ACTIVITY_SEGMENT_STATUS,
  ActivitySegmentStatus,
  ScheduleBlockType,
} from '../models/activity-segment.model';

export const ACTIVITY_SEGMENT_LABELS: Record<ActivitySegmentStatus, string> = {
  [ACTIVITY_SEGMENT_STATUS.ACTIVE]: 'Active',
  [ACTIVITY_SEGMENT_STATUS.OFF_TASK]: 'Off Task',
  [ACTIVITY_SEGMENT_STATUS.PAID_BREAK]: 'Paid Break',
  [ACTIVITY_SEGMENT_STATUS.UNPAID_BREAK]: 'Unpaid Break',
  [ACTIVITY_SEGMENT_STATUS.MEETING]: 'Meeting / SOS / Fast Start',
};

export const ACTIVITY_SEGMENT_SOURCE_LABELS = {
  SCAN_EVENTS: 'Scan Events',
  MANUAL_SCHEDULE: 'Manual Schedule',
} as const;

export const SCHEDULE_BLOCK_TYPE_LABELS: Record<ScheduleBlockType, string> = {
  PAID_BREAK: 'Paid Break',
  UNPAID_BREAK: 'Unpaid Break / Lunch',
  MEETING: 'Meeting / SOS / Fast Start',
};

export const SCHEDULED_SEGMENT_STATUSES: ActivitySegmentStatus[] = [
  ACTIVITY_SEGMENT_STATUS.PAID_BREAK,
  ACTIVITY_SEGMENT_STATUS.UNPAID_BREAK,
  ACTIVITY_SEGMENT_STATUS.MEETING,
];
