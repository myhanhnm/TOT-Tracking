import { ShiftUtilization, TimelineSegment } from '../models';
import { ScheduleBlock } from '../models/schedule-block.model';
import { ScanEvent } from '../models/scan-event.model';
import { calculateGapsForAssociate } from './gapCalculation';
import {
  applyScheduleBlocksToTimeline,
  buildBaseSegmentsFromGaps,
  calculateSegmentTimeBreakdown,
} from './timelineMerge';
import { formatUtilizationPercent } from './utilization';

export { formatUtilizationPercent };

export function buildShiftUtilization(
  events: ScanEvent[],
  scheduleBlocks: ScheduleBlock[],
  loginId: string,
): ShiftUtilization | null {
  if (events.length === 0) {
    return null;
  }

  const sortedEvents = [...events].sort(
    (left, right) => left.eventTime.getTime() - right.eventTime.getTime(),
  );

  const firstEvent = sortedEvents[0];
  const lastEvent = sortedEvents[sortedEvents.length - 1];

  if (!firstEvent || !lastEvent) {
    return null;
  }

  const firstScan = firstEvent.eventTime;
  const lastScan = lastEvent.eventTime;
  const totalShiftTimeMs = lastScan.getTime() - firstScan.getTime();

  const gaps = calculateGapsForAssociate(sortedEvents);
  const baseSegments = buildBaseSegmentsFromGaps(gaps, loginId);
  const mergedSegments = applyScheduleBlocksToTimeline(baseSegments, scheduleBlocks);
  const breakdown = calculateSegmentTimeBreakdown(mergedSegments);

  return {
    loginId,
    firstScan,
    lastScan,
    totalShiftTimeMs,
    activeTimeMs: breakdown.activeTimeMs,
    offTaskTimeMs: breakdown.offTaskTimeMs,
    paidBreakTimeMs: breakdown.paidBreakTimeMs,
    unpaidBreakTimeMs: breakdown.unpaidBreakTimeMs,
    meetingTimeMs: breakdown.meetingTimeMs,
    totalScheduledTimeMs: breakdown.totalScheduledTimeMs,
    utilizationPercent: breakdown.utilizationPercent,
    segments: mergedSegments,
  };
}

export function getOffTaskSegments(segments: TimelineSegment[]): TimelineSegment[] {
  return segments.filter((segment) => segment.status === 'OFF_TASK');
}

export function getScheduledSegments(segments: TimelineSegment[]): TimelineSegment[] {
  return segments.filter(
    (segment) =>
      segment.status === 'PAID_BREAK' ||
      segment.status === 'UNPAID_BREAK' ||
      segment.status === 'MEETING',
  );
}
