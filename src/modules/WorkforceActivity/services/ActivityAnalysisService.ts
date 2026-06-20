import {
  ActivityAnalysisResult,
  AssociateSummary,
  OffTaskGap,
  ScanEvent,
  ShiftUtilization,
  TimelineSegment,
  WorkforceMetrics,
} from '../models';
import { ScheduleBlock } from '../models/schedule-block.model';
import { calculateScanRatePerHour } from 'src/shared/utils/utilization';
import { buildShiftUtilization, getOffTaskSegments } from 'src/shared/utils/timelineSegments';

type AssociateKey = {
  loginId: string;
  associateName: string;
};

function segmentToOffTaskGap(segment: TimelineSegment, associateName: string): OffTaskGap {
  return {
    associateName,
    loginId: segment.loginId,
    startTime: segment.startTime,
    endTime: segment.endTime,
    durationMs: segment.durationMs,
    isOffTask: true,
  };
}

export class ActivityAnalysisService {
  static analyze(
    scanEvents: ScanEvent[],
    scheduleBlocks: ScheduleBlock[] = [],
  ): ActivityAnalysisResult {
    const sortedEvents = ActivityAnalysisService.sortEvents(scanEvents);
    const eventsByAssociate = ActivityAnalysisService.groupEventsByAssociate(sortedEvents);
    const shiftUtilizations = ActivityAnalysisService.buildShiftUtilizations(
      eventsByAssociate,
      scheduleBlocks,
    );
    const offTaskGaps = ActivityAnalysisService.buildOffTaskGapsFromUtilizations(
      eventsByAssociate,
      shiftUtilizations,
    );
    const associateSummaries = ActivityAnalysisService.buildAssociateSummaries(
      eventsByAssociate,
      shiftUtilizations,
    );
    const metrics = ActivityAnalysisService.buildDashboardMetrics(
      associateSummaries,
      sortedEvents,
      offTaskGaps,
    );

    return {
      scanEvents: sortedEvents,
      associateSummaries,
      offTaskGaps,
      shiftUtilizations,
      metrics,
    };
  }

  static getAssociateSummary(
    analysis: ActivityAnalysisResult,
    loginId: string,
  ): AssociateSummary | undefined {
    return analysis.associateSummaries.find((summary) => summary.loginId === loginId);
  }

  static getAssociateShiftUtilization(
    analysis: ActivityAnalysisResult,
    loginId: string,
  ): ShiftUtilization | undefined {
    return analysis.shiftUtilizations[loginId];
  }

  static getAssociateGaps(analysis: ActivityAnalysisResult, loginId: string): OffTaskGap[] {
    return analysis.offTaskGaps.filter((gap) => gap.loginId === loginId);
  }

  static getAssociateEvents(analysis: ActivityAnalysisResult, loginId: string): ScanEvent[] {
    return analysis.scanEvents.filter((event) => event.loginId === loginId);
  }

  static getAssociateOffTaskGaps(analysis: ActivityAnalysisResult, loginId: string): OffTaskGap[] {
    return ActivityAnalysisService.getAssociateGaps(analysis, loginId);
  }

  private static sortEvents(scanEvents: ScanEvent[]): ScanEvent[] {
    return [...scanEvents].sort((left, right) => {
      const nameComparison = left.associateName.localeCompare(right.associateName);

      if (nameComparison !== 0) {
        return nameComparison;
      }

      return left.eventTime.getTime() - right.eventTime.getTime();
    });
  }

  private static groupEventsByAssociate(
    scanEvents: ScanEvent[],
  ): Map<string, { key: AssociateKey; events: ScanEvent[] }> {
    const grouped = new Map<string, { key: AssociateKey; events: ScanEvent[] }>();

    scanEvents.forEach((event) => {
      const existing = grouped.get(event.loginId);

      if (existing) {
        existing.events.push(event);
        return;
      }

      grouped.set(event.loginId, {
        key: {
          loginId: event.loginId,
          associateName: event.associateName,
        },
        events: [event],
      });
    });

    return grouped;
  }

  private static buildShiftUtilizations(
    eventsByAssociate: Map<string, { key: AssociateKey; events: ScanEvent[] }>,
    scheduleBlocks: ScheduleBlock[],
  ): Record<string, ShiftUtilization> {
    const utilizations: Record<string, ShiftUtilization> = {};

    eventsByAssociate.forEach(({ key, events }) => {
      const utilization = buildShiftUtilization(events, scheduleBlocks, key.loginId);

      if (utilization) {
        utilizations[key.loginId] = utilization;
      }
    });

    return utilizations;
  }

  private static buildOffTaskGapsFromUtilizations(
    eventsByAssociate: Map<string, { key: AssociateKey; events: ScanEvent[] }>,
    shiftUtilizations: Record<string, ShiftUtilization>,
  ): OffTaskGap[] {
    const gaps: OffTaskGap[] = [];

    eventsByAssociate.forEach(({ key }) => {
      const utilization = shiftUtilizations[key.loginId];

      if (!utilization) {
        return;
      }

      const offTaskSegments = getOffTaskSegments(utilization.segments);
      gaps.push(
        ...offTaskSegments.map((segment) => segmentToOffTaskGap(segment, key.associateName)),
      );
    });

    return gaps;
  }

  private static buildAssociateSummaries(
    eventsByAssociate: Map<string, { key: AssociateKey; events: ScanEvent[] }>,
    shiftUtilizations: Record<string, ShiftUtilization>,
  ): AssociateSummary[] {
    const summaries: AssociateSummary[] = [];

    eventsByAssociate.forEach(({ key, events }) => {
      const utilization = shiftUtilizations[key.loginId];
      const firstEvent = events[0];
      const lastEvent = events[events.length - 1];

      if (!utilization || !firstEvent || !lastEvent) {
        return;
      }

      const offTaskSegments = getOffTaskSegments(utilization.segments);
      const shiftDurationMs = lastEvent.eventTime.getTime() - firstEvent.eventTime.getTime();
      const totalOffTaskDurationMs = utilization.offTaskTimeMs;
      const longestGapMs =
        offTaskSegments.length > 0
          ? Math.max(...offTaskSegments.map((segment) => segment.durationMs))
          : 0;
      const averageGapMs =
        offTaskSegments.length > 0
          ? Math.round(totalOffTaskDurationMs / offTaskSegments.length)
          : 0;

      summaries.push({
        associateName: key.associateName,
        loginId: key.loginId,
        totalScans: events.length,
        firstScan: firstEvent.eventTime,
        lastScan: lastEvent.eventTime,
        offTaskGapCount: offTaskSegments.length,
        totalOffTaskDurationMs,
        activeTimeMs: utilization.activeTimeMs,
        paidBreakTimeMs: utilization.paidBreakTimeMs,
        unpaidBreakTimeMs: utilization.unpaidBreakTimeMs,
        meetingTimeMs: utilization.meetingTimeMs,
        totalScheduledTimeMs: utilization.totalScheduledTimeMs,
        utilizationPercent: utilization.utilizationPercent,
        scanRatePerHour: calculateScanRatePerHour(events.length, shiftDurationMs),
        longestGapMs,
        averageGapMs,
      });
    });

    return summaries.sort(
      (left, right) => right.totalOffTaskDurationMs - left.totalOffTaskDurationMs,
    );
  }

  private static buildDashboardMetrics(
    associateSummaries: AssociateSummary[],
    scanEvents: ScanEvent[],
    offTaskGaps: OffTaskGap[],
  ): WorkforceMetrics {
    const totalOffTaskDurationMs = associateSummaries.reduce(
      (total, summary) => total + summary.totalOffTaskDurationMs,
      0,
    );
    const totalActiveTimeMs = associateSummaries.reduce(
      (total, summary) => total + summary.activeTimeMs,
      0,
    );
    const totalPaidBreakTimeMs = associateSummaries.reduce(
      (total, summary) => total + summary.paidBreakTimeMs,
      0,
    );
    const totalUnpaidBreakTimeMs = associateSummaries.reduce(
      (total, summary) => total + summary.unpaidBreakTimeMs,
      0,
    );
    const totalMeetingTimeMs = associateSummaries.reduce(
      (total, summary) => total + summary.meetingTimeMs,
      0,
    );
    const totalScheduledTimeMs = associateSummaries.reduce(
      (total, summary) => total + summary.totalScheduledTimeMs,
      0,
    );
    const longestGapMs =
      offTaskGaps.length > 0 ? Math.max(...offTaskGaps.map((gap) => gap.durationMs)) : 0;
    const averageGapMs =
      offTaskGaps.length > 0 ? Math.round(totalOffTaskDurationMs / offTaskGaps.length) : 0;
    const totalShiftMs = associateSummaries.reduce(
      (total, summary) => total + (summary.lastScan.getTime() - summary.firstScan.getTime()),
      0,
    );
    const utilizationPercent =
      totalActiveTimeMs + totalOffTaskDurationMs > 0
        ? Math.round(
            (totalActiveTimeMs / (totalActiveTimeMs + totalOffTaskDurationMs)) * 1000,
          ) / 10
        : 0;

    return {
      totalAssociates: associateSummaries.length,
      totalScanEvents: scanEvents.length,
      totalOffTaskGaps: offTaskGaps.length,
      totalOffTaskDurationMs,
      totalActiveTimeMs,
      totalPaidBreakTimeMs,
      totalUnpaidBreakTimeMs,
      totalMeetingTimeMs,
      totalScheduledTimeMs,
      utilizationPercent,
      longestGapMs,
      averageGapMs,
      scanRatePerHour: calculateScanRatePerHour(scanEvents.length, totalShiftMs),
    };
  }
}
