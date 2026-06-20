import { format, parse, startOfDay } from 'date-fns';

import { ScheduleBlock, ResolvedScheduleBlock } from 'src/modules/WorkforceActivity/models/schedule-block.model';
import { TimelineSegment } from 'src/modules/WorkforceActivity/models/activity-segment.model';

const TIME_FORMATS = ['HH:mm', 'H:mm'] as const;

function normalizeTimeValue(timeValue: string): string {
  return timeValue.trim();
}

export function parseTimeOnDate(timeValue: string, date: Date): Date | null {
  const trimmed = normalizeTimeValue(timeValue);

  if (!trimmed) {
    return null;
  }

  const dayStart = startOfDay(date);

  for (const timeFormat of TIME_FORMATS) {
    const candidate = trimmed.length > 5 ? trimmed.slice(0, 5) : trimmed;

    try {
      const parsed = parse(candidate, timeFormat, dayStart);

      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export function formatTimeValue(date: Date): string {
  return format(date, 'HH:mm');
}

export function resolveScheduleBlock(
  block: ScheduleBlock,
  shiftDate: Date,
): ResolvedScheduleBlock | null {
  const startDateTime = parseTimeOnDate(block.startTime, shiftDate);
  const endDateTime = parseTimeOnDate(block.endTime, shiftDate);

  if (!startDateTime || !endDateTime || endDateTime.getTime() <= startDateTime.getTime()) {
    return null;
  }

  return {
    ...block,
    startDateTime,
    endDateTime,
  };
}

export function getUniqueDatesFromSegments(segments: TimelineSegment[]): Date[] {
  const dateKeys = new Set<string>();

  segments.forEach((segment) => {
    dateKeys.add(format(startOfDay(segment.startTime), 'yyyy-MM-dd'));
    dateKeys.add(format(startOfDay(segment.endTime), 'yyyy-MM-dd'));
  });

  return [...dateKeys]
    .sort()
    .map((dateKey) => parse(`${dateKey} 00:00:00`, 'yyyy-MM-dd HH:mm:ss', new Date()));
}

export function resolveScheduleBlocksForDates(
  blocks: ScheduleBlock[],
  dates: Date[],
): ResolvedScheduleBlock[] {
  const resolved: ResolvedScheduleBlock[] = [];

  dates.forEach((date) => {
    blocks.forEach((block) => {
      const resolvedBlock = resolveScheduleBlock(block, date);

      if (resolvedBlock) {
        resolved.push(resolvedBlock);
      }
    });
  });

  return resolved.sort(
    (left, right) => left.startDateTime.getTime() - right.startDateTime.getTime(),
  );
}

export function resolveScheduleBlocksForShift(
  blocks: ScheduleBlock[],
  shiftDate: Date,
): ResolvedScheduleBlock[] {
  return resolveScheduleBlocksForDates(blocks, [shiftDate]);
}

export function clipResolvedBlockToShift(
  block: ResolvedScheduleBlock,
  shiftStart: Date,
  shiftEnd: Date,
): ResolvedScheduleBlock | null {
  const clippedStart = Math.max(block.startDateTime.getTime(), shiftStart.getTime());
  const clippedEnd = Math.min(block.endDateTime.getTime(), shiftEnd.getTime());

  if (clippedEnd <= clippedStart) {
    return null;
  }

  return {
    ...block,
    startDateTime: new Date(clippedStart),
    endDateTime: new Date(clippedEnd),
  };
}

export function resolveAndClipScheduleBlocksForTimeline(
  segments: TimelineSegment[],
  scheduleBlocks: ScheduleBlock[],
): ResolvedScheduleBlock[] {
  if (segments.length === 0 || scheduleBlocks.length === 0) {
    return [];
  }

  const shiftStart = new Date(
    Math.min(...segments.map((segment) => segment.startTime.getTime())),
  );
  const shiftEnd = new Date(Math.max(...segments.map((segment) => segment.endTime.getTime())));
  const uniqueDates = getUniqueDatesFromSegments(segments);

  return resolveScheduleBlocksForDates(scheduleBlocks, uniqueDates)
    .map((block) => clipResolvedBlockToShift(block, shiftStart, shiftEnd))
    .filter((block): block is ResolvedScheduleBlock => block !== null);
}
