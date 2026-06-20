import { GAP_SEVERITY_THRESHOLDS_MS } from '../constants';
import { GAP_SEVERITY, GapSeverity } from '../models/gap-severity.model';
import { OffTaskGap } from '../models/off-task-gap.model';
import { OffTaskGapStats } from '../models/off-task-gap-stats.model';

export function getGapSeverity(durationMs: number): GapSeverity {
  if (durationMs <= GAP_SEVERITY_THRESHOLDS_MS.LOW_MAX) {
    return GAP_SEVERITY.LOW;
  }

  if (durationMs <= GAP_SEVERITY_THRESHOLDS_MS.MEDIUM_MAX) {
    return GAP_SEVERITY.MEDIUM;
  }

  return GAP_SEVERITY.HIGH;
}

export function filterOffTaskGaps(gaps: OffTaskGap[]): OffTaskGap[] {
  return gaps.filter((gap) => gap.isOffTask);
}

export function computeOffTaskGapStats(gaps: OffTaskGap[]): OffTaskGapStats {
  const offTaskGaps = filterOffTaskGaps(gaps);

  if (offTaskGaps.length === 0) {
    return {
      totalDurationMs: 0,
      longestGapMs: 0,
      averageGapMs: 0,
      gapCount: 0,
    };
  }

  const totalDurationMs = offTaskGaps.reduce((total, gap) => total + gap.durationMs, 0);
  const longestGapMs = Math.max(...offTaskGaps.map((gap) => gap.durationMs));

  return {
    totalDurationMs,
    longestGapMs,
    averageGapMs: Math.round(totalDurationMs / offTaskGaps.length),
    gapCount: offTaskGaps.length,
  };
}
