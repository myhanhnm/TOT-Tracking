import { useMemo } from 'react';

import { TOP_ASSOCIATES_CHART_LIMIT } from '../constants';
import { AssociateSummary, ChartDatum, WorkforceMetrics } from '../models';
import { ActivityChartService, ActivityRankingService } from '../services';
import { useFilteredAnalysis } from './useFilteredAnalysis';

type WorkforceDashboardData = {
  metrics: WorkforceMetrics | null;
  associates: AssociateSummary[];
  topOffTaskChart: ChartDatum[];
  topScanVolumeChart: ChartDatum[];
  utilizationDistribution: ChartDatum[];
  gapDurationDistribution: ChartDatum[];
  topOffTaskAssociates: AssociateSummary[];
  topUtilizedAssociates: AssociateSummary[];
  topScanVolumeAssociates: AssociateSummary[];
  isLoading: boolean;
  hasData: boolean;
  hasResults: boolean;
};

export function useWorkforceDashboardData(): WorkforceDashboardData {
  const { analysis, isLoading, hasData } = useFilteredAnalysis();

  return useMemo(() => {
    if (!analysis) {
      return {
        metrics: null,
        associates: [],
        topOffTaskChart: [],
        topScanVolumeChart: [],
        utilizationDistribution: [],
        gapDurationDistribution: [],
        topOffTaskAssociates: [],
        topUtilizedAssociates: [],
        topScanVolumeAssociates: [],
        isLoading,
        hasData,
        hasResults: false,
      };
    }

    const { associateSummaries, offTaskGaps, metrics } = analysis;

    return {
      metrics,
      associates: associateSummaries,
      topOffTaskChart: ActivityChartService.buildTopOffTaskChartData(associateSummaries),
      topScanVolumeChart: ActivityChartService.buildTopScanVolumeChartData(associateSummaries),
      utilizationDistribution: ActivityChartService.buildUtilizationDistribution(associateSummaries),
      gapDurationDistribution: ActivityChartService.buildGapDurationDistribution(offTaskGaps),
      topOffTaskAssociates: ActivityRankingService.getTopOffTaskAssociates(associateSummaries).slice(
        0,
        TOP_ASSOCIATES_CHART_LIMIT,
      ),
      topUtilizedAssociates: ActivityRankingService.getTopUtilizedAssociates(
        associateSummaries,
      ).slice(0, TOP_ASSOCIATES_CHART_LIMIT),
      topScanVolumeAssociates: ActivityRankingService.getTopScanVolumeAssociates(
        associateSummaries,
      ).slice(0, TOP_ASSOCIATES_CHART_LIMIT),
      isLoading,
      hasData,
      hasResults: associateSummaries.length > 0,
    };
  }, [analysis, hasData, isLoading]);
}
