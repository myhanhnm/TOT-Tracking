import {
  ACTIVITY_SEGMENT_SOURCE,
  ACTIVITY_SEGMENT_STATUS,
  ActivitySegmentStatus,
  ResolvedScheduleBlock,
  ScheduleBlock,
  SegmentTimeBreakdown,
  TimelineSegment,
} from 'src/modules/WorkforceActivity/models/activity-segment.model';
import { ACTIVITY_SEGMENT_LABELS } from 'src/modules/WorkforceActivity/constants/segment.constants';
import { resolveAndClipScheduleBlocksForTimeline } from './scheduleBlockTime';
import { calculateUtilizationPercent } from './utilization';

function createSegmentId(
  loginId: string,
  startTime: Date,
  endTime: Date,
  status: ActivitySegmentStatus,
  source: TimelineSegment['source'],
): string {
  return `${loginId}-${startTime.getTime()}-${endTime.getTime()}-${status}-${source}`;
}

function createSegment(
  loginId: string,
  startTime: Date,
  endTime: Date,
  status: ActivitySegmentStatus,
  label: string,
  source: TimelineSegment['source'],
): TimelineSegment {
  const durationMs = endTime.getTime() - startTime.getTime();

  return {
    id: createSegmentId(loginId, startTime, endTime, status, source),
    loginId,
    startTime,
    endTime,
    durationMs,
    durationSeconds: Math.round(durationMs / 1000),
    status,
    label,
    source,
  };
}

function createScheduleSegment(
  loginId: string,
  startTime: Date,
  endTime: Date,
  block: ResolvedScheduleBlock,
): TimelineSegment {
  return createSegment(
    loginId,
    startTime,
    endTime,
    block.type,
    block.label,
    ACTIVITY_SEGMENT_SOURCE.MANUAL_SCHEDULE,
  );
}

function createSubSegment(
  segment: TimelineSegment,
  startTime: Date,
  endTime: Date,
): TimelineSegment | null {
  if (endTime.getTime() <= startTime.getTime()) {
    return null;
  }

  return createSegment(
    segment.loginId,
    startTime,
    endTime,
    segment.status,
    segment.label,
    segment.source,
  );
}

function segmentsOverlap(
  segmentStart: number,
  segmentEnd: number,
  blockStart: number,
  blockEnd: number,
): boolean {
  return segmentStart < blockEnd && segmentEnd > blockStart;
}

export function getTimelineTotalDurationMs(segments: TimelineSegment[]): number {
  return segments.reduce((total, segment) => total + segment.durationMs, 0);
}

export function applyScheduleBlockToSegments(
  segments: TimelineSegment[],
  block: ResolvedScheduleBlock,
): TimelineSegment[] {
  const result: TimelineSegment[] = [];
  const blockStart = block.startDateTime.getTime();
  const blockEnd = block.endDateTime.getTime();

  segments.forEach((segment) => {
    const segStart = segment.startTime.getTime();
    const segEnd = segment.endTime.getTime();

    if (!segmentsOverlap(segStart, segEnd, blockStart, blockEnd)) {
      result.push(segment);
      return;
    }

    if (segStart < blockStart) {
      const before = createSubSegment(segment, segment.startTime, block.startDateTime);

      if (before) {
        result.push(before);
      }
    }

    const overlapStart = Math.max(segStart, blockStart);
    const overlapEnd = Math.min(segEnd, blockEnd);

    if (segment.status === ACTIVITY_SEGMENT_STATUS.OFF_TASK) {
      result.push(
        createScheduleSegment(
          segment.loginId,
          new Date(overlapStart),
          new Date(overlapEnd),
          block,
        ),
      );
    } else {
      const overlapSegment = createSubSegment(
        segment,
        new Date(overlapStart),
        new Date(overlapEnd),
      );

      if (overlapSegment) {
        result.push(overlapSegment);
      }
    }

    if (segEnd > blockEnd) {
      const after = createSubSegment(segment, block.endDateTime, segment.endTime);

      if (after) {
        result.push(after);
      }
    }
  });

  return result;
}

export function applyScheduleBlocksToSegments(
  segments: TimelineSegment[],
  resolvedBlocks: ResolvedScheduleBlock[],
): TimelineSegment[] {
  return resolvedBlocks.reduce(
    (currentSegments, block) => applyScheduleBlockToSegments(currentSegments, block),
    segments,
  );
}

export function applyScheduleBlocksToTimeline(
  timelineSegments: TimelineSegment[],
  scheduleBlocks: ScheduleBlock[],
): TimelineSegment[] {
  if (timelineSegments.length === 0 || scheduleBlocks.length === 0) {
    return timelineSegments;
  }

  const resolvedBlocks = resolveAndClipScheduleBlocksForTimeline(timelineSegments, scheduleBlocks);

  if (resolvedBlocks.length === 0) {
    return timelineSegments;
  }

  return mergeAdjacentSegments(
    applyScheduleBlocksToSegments(timelineSegments, resolvedBlocks),
  );
}

export function mergeAdjacentSegments(segments: TimelineSegment[]): TimelineSegment[] {
  if (segments.length === 0) {
    return [];
  }

  const sorted = [...segments].sort(
    (left, right) => left.startTime.getTime() - right.startTime.getTime(),
  );

  const merged: TimelineSegment[] = [];
  let current = sorted[0];

  if (!current) {
    return [];
  }

  for (let index = 1; index < sorted.length; index += 1) {
    const next = sorted[index];

    if (!next) {
      continue;
    }

    const sameType =
      current.status === next.status &&
      current.label === next.label &&
      current.source === next.source &&
      current.endTime.getTime() === next.startTime.getTime();

    if (sameType) {
      current = createSegment(
        current.loginId,
        current.startTime,
        next.endTime,
        current.status,
        current.label,
        current.source,
      );
      continue;
    }

    merged.push(current);
    current = next;
  }

  merged.push(current);
  return merged;
}

export function calculateSegmentTimeBreakdown(segments: TimelineSegment[]): SegmentTimeBreakdown {
  const activeTimeMs = segments
    .filter((segment) => segment.status === ACTIVITY_SEGMENT_STATUS.ACTIVE)
    .reduce((total, segment) => total + segment.durationMs, 0);

  const offTaskTimeMs = segments
    .filter((segment) => segment.status === ACTIVITY_SEGMENT_STATUS.OFF_TASK)
    .reduce((total, segment) => total + segment.durationMs, 0);

  const paidBreakTimeMs = segments
    .filter((segment) => segment.status === ACTIVITY_SEGMENT_STATUS.PAID_BREAK)
    .reduce((total, segment) => total + segment.durationMs, 0);

  const unpaidBreakTimeMs = segments
    .filter((segment) => segment.status === ACTIVITY_SEGMENT_STATUS.UNPAID_BREAK)
    .reduce((total, segment) => total + segment.durationMs, 0);

  const meetingTimeMs = segments
    .filter((segment) => segment.status === ACTIVITY_SEGMENT_STATUS.MEETING)
    .reduce((total, segment) => total + segment.durationMs, 0);

  const totalScheduledTimeMs = paidBreakTimeMs + unpaidBreakTimeMs + meetingTimeMs;

  return {
    activeTimeMs,
    offTaskTimeMs,
    paidBreakTimeMs,
    unpaidBreakTimeMs,
    meetingTimeMs,
    totalScheduledTimeMs,
    utilizationPercent: calculateUtilizationPercent(activeTimeMs, offTaskTimeMs),
  };
}

export function buildBaseSegmentsFromGaps(
  gaps: Array<{
    startTime: Date;
    endTime: Date;
    durationMs: number;
    isOffTask: boolean;
  }>,
  loginId: string,
): TimelineSegment[] {
  return gaps.map((gap) => {
    const status = gap.isOffTask
      ? ACTIVITY_SEGMENT_STATUS.OFF_TASK
      : ACTIVITY_SEGMENT_STATUS.ACTIVE;

    return createSegment(
      loginId,
      gap.startTime,
      gap.endTime,
      status,
      ACTIVITY_SEGMENT_LABELS[status],
      ACTIVITY_SEGMENT_SOURCE.SCAN_EVENTS,
    );
  });
}
