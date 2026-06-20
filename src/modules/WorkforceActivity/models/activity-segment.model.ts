export const ACTIVITY_SEGMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  OFF_TASK: 'OFF_TASK',
  PAID_BREAK: 'PAID_BREAK',
  UNPAID_BREAK: 'UNPAID_BREAK',
  MEETING: 'MEETING',
} as const;

export type ActivitySegmentStatus =
  (typeof ACTIVITY_SEGMENT_STATUS)[keyof typeof ACTIVITY_SEGMENT_STATUS];

export const ACTIVITY_SEGMENT_SOURCE = {
  SCAN_EVENTS: 'SCAN_EVENTS',
  MANUAL_SCHEDULE: 'MANUAL_SCHEDULE',
} as const;

export type ActivitySegmentSource =
  (typeof ACTIVITY_SEGMENT_SOURCE)[keyof typeof ACTIVITY_SEGMENT_SOURCE];

export const SCHEDULE_BLOCK_TYPES = {
  PAID_BREAK: 'PAID_BREAK',
  UNPAID_BREAK: 'UNPAID_BREAK',
  MEETING: 'MEETING',
} as const;

export type ScheduleBlockType =
  (typeof SCHEDULE_BLOCK_TYPES)[keyof typeof SCHEDULE_BLOCK_TYPES];

export const SCHEDULE_APPLIES_TO = {
  ALL_ASSOCIATES: 'ALL_ASSOCIATES',
  SELECTED_ASSOCIATES: 'SELECTED_ASSOCIATES',
} as const;

export type ScheduleAppliesTo =
  (typeof SCHEDULE_APPLIES_TO)[keyof typeof SCHEDULE_APPLIES_TO];

export type TimelineSegment = {
  id: string;
  loginId: string;
  startTime: Date;
  endTime: Date;
  durationMs: number;
  durationSeconds: number;
  status: ActivitySegmentStatus;
  label: string;
  source: ActivitySegmentSource;
};

export type ScheduleBlock = {
  id: string;
  type: ScheduleBlockType;
  label: string;
  startTime: string;
  endTime: string;
  appliesTo: ScheduleAppliesTo;
};

export type ResolvedScheduleBlock = ScheduleBlock & {
  startDateTime: Date;
  endDateTime: Date;
};

export type SegmentTimeBreakdown = {
  activeTimeMs: number;
  offTaskTimeMs: number;
  paidBreakTimeMs: number;
  unpaidBreakTimeMs: number;
  meetingTimeMs: number;
  totalScheduledTimeMs: number;
  utilizationPercent: number;
};
