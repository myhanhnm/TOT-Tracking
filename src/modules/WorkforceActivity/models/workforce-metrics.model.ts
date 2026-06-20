export type WorkforceMetrics = {
  totalAssociates: number;
  totalScanEvents: number;
  totalOffTaskGaps: number;
  totalOffTaskDurationMs: number;
  totalActiveTimeMs: number;
  totalPaidBreakTimeMs: number;
  totalUnpaidBreakTimeMs: number;
  totalMeetingTimeMs: number;
  totalScheduledTimeMs: number;
  utilizationPercent: number;
  longestGapMs: number;
  averageGapMs: number;
  scanRatePerHour: number;
};
