import { TimelineSegment } from './timeline-segment.model';

export type ShiftUtilization = {
  loginId: string;
  firstScan: Date;
  lastScan: Date;
  totalShiftTimeMs: number;
  activeTimeMs: number;
  offTaskTimeMs: number;
  paidBreakTimeMs: number;
  unpaidBreakTimeMs: number;
  meetingTimeMs: number;
  totalScheduledTimeMs: number;
  utilizationPercent: number;
  segments: TimelineSegment[];
};
