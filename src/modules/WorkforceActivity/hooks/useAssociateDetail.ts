import { useActivityContext } from '../context';
import { ActivityAnalysisService } from '../services';
import { AssociateSummary, OffTaskGap, OffTaskGapStats, ShiftUtilization, TimelineSegment } from '../models';
import { computeOffTaskGapStats, getScheduledSegments } from '../utils';

type UseAssociateDetailParams = {
  loginId: string;
};

type UseAssociateDetailReturn = {
  summary: AssociateSummary | undefined;
  offTaskGaps: OffTaskGap[];
  offTaskStats: OffTaskGapStats;
  scheduleSegments: TimelineSegment[];
  shiftUtilization: ShiftUtilization | null;
  isLoading: boolean;
  hasData: boolean;
};

export function useAssociateDetail({ loginId }: UseAssociateDetailParams): UseAssociateDetailReturn {
  const { filteredAnalysis, isLoading, analysis } = useActivityContext();

  const summary = filteredAnalysis
    ? ActivityAnalysisService.getAssociateSummary(filteredAnalysis, loginId)
    : undefined;

  const offTaskGaps = filteredAnalysis
    ? ActivityAnalysisService.getAssociateOffTaskGaps(filteredAnalysis, loginId)
    : [];

  const offTaskStats = computeOffTaskGapStats(offTaskGaps);

  const shiftUtilization = filteredAnalysis
    ? ActivityAnalysisService.getAssociateShiftUtilization(filteredAnalysis, loginId) ?? null
    : null;

  const scheduleSegments = shiftUtilization
    ? getScheduledSegments(shiftUtilization.segments)
    : [];

  return {
    summary,
    offTaskGaps,
    offTaskStats,
    scheduleSegments,
    shiftUtilization,
    isLoading,
    hasData: analysis !== null,
  };
}
