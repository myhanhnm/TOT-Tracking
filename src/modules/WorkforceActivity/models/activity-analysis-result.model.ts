import { AssociateSummary } from './associate-summary.model';
import { DashboardMetrics } from './dashboard-metrics.model';
import { OffTaskGap } from './off-task-gap.model';
import { ScanEvent } from './scan-event.model';
import { ShiftUtilization } from './shift-utilization.model';

export type ActivityAnalysisResult = {
  scanEvents: ScanEvent[];
  associateSummaries: AssociateSummary[];
  offTaskGaps: OffTaskGap[];
  shiftUtilizations: Record<string, ShiftUtilization>;
  metrics: DashboardMetrics;
};
