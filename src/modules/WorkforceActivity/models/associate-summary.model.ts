export type AssociateSummary = {
  associateName: string;
  loginId: string;
  totalScans: number;
  firstScan: Date;
  lastScan: Date;
  offTaskGapCount: number;
  totalOffTaskDurationMs: number;
  activeTimeMs: number;
  paidBreakTimeMs: number;
  unpaidBreakTimeMs: number;
  meetingTimeMs: number;
  totalScheduledTimeMs: number;
  utilizationPercent: number;
  scanRatePerHour: number;
  longestGapMs: number;
  averageGapMs: number;
};
