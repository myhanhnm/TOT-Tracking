import { TOP_ASSOCIATES_CHART_LIMIT } from '../constants';
import { AssociateSummary, ChartDatum, OffTaskGap } from '../models';
import { durationToMinutes, formatDuration } from 'src/shared/utils';

function truncateName(name: string, maxLength = 14): string {
  if (name.length <= maxLength) {
    return name;
  }

  return `${name.slice(0, maxLength)}…`;
}

export class ActivityChartService {
  static buildTopOffTaskChartData(associates: AssociateSummary[]): ChartDatum[] {
    return [...associates]
      .sort((left, right) => right.totalOffTaskDurationMs - left.totalOffTaskDurationMs)
      .slice(0, TOP_ASSOCIATES_CHART_LIMIT)
      .map((associate) => ({
        name: truncateName(associate.associateName),
        value: durationToMinutes(associate.totalOffTaskDurationMs),
        displayValue: formatDuration(associate.totalOffTaskDurationMs),
      }));
  }

  static buildTopScanVolumeChartData(associates: AssociateSummary[]): ChartDatum[] {
    return [...associates]
      .sort((left, right) => right.totalScans - left.totalScans)
      .slice(0, TOP_ASSOCIATES_CHART_LIMIT)
      .map((associate) => ({
        name: truncateName(associate.associateName),
        value: associate.totalScans,
        displayValue: associate.totalScans.toLocaleString(),
      }));
  }

  static buildUtilizationDistribution(associates: AssociateSummary[]): ChartDatum[] {
    const buckets = [
      { label: '0-50%', min: 0, max: 50 },
      { label: '50-70%', min: 50, max: 70 },
      { label: '70-85%', min: 70, max: 85 },
      { label: '85-95%', min: 85, max: 95 },
      { label: '95%+', min: 95, max: 101 },
    ];

    return buckets.map((bucket) => {
      const count = associates.filter(
        (associate) =>
          associate.utilizationPercent >= bucket.min &&
          associate.utilizationPercent < bucket.max,
      ).length;

      return {
        name: bucket.label,
        value: count,
        displayValue: count.toLocaleString(),
      };
    });
  }

  static buildGapDurationDistribution(offTaskGaps: OffTaskGap[]): ChartDatum[] {
    const offTaskOnly = offTaskGaps.filter((gap) => gap.isOffTask);
    const buckets = [
      { label: '10-15m', min: 10, max: 15 },
      { label: '15-30m', min: 15, max: 30 },
      { label: '30-60m', min: 30, max: 60 },
      { label: '1-2h', min: 60, max: 120 },
      { label: '2h+', min: 120, max: Infinity },
    ];

    return buckets.map((bucket) => {
      const count = offTaskOnly.filter((gap) => {
        const minutes = durationToMinutes(gap.durationMs);
        return minutes > bucket.min && minutes <= bucket.max;
      }).length;

      return {
        name: bucket.label,
        value: count,
        displayValue: count.toLocaleString(),
      };
    });
  }
}

export class ActivityRankingService {
  static getTopOffTaskAssociates(associates: AssociateSummary[]): AssociateSummary[] {
    return [...associates].sort(
      (left, right) => right.totalOffTaskDurationMs - left.totalOffTaskDurationMs,
    );
  }

  static getTopUtilizedAssociates(associates: AssociateSummary[]): AssociateSummary[] {
    return [...associates].sort(
      (left, right) => right.utilizationPercent - left.utilizationPercent,
    );
  }

  static getTopScanVolumeAssociates(associates: AssociateSummary[]): AssociateSummary[] {
    return [...associates].sort((left, right) => right.totalScans - left.totalScans);
  }
}
