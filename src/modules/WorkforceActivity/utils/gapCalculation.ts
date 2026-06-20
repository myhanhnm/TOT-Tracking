import { OFF_TASK_GAP_THRESHOLD_MS } from '../constants';
import { OffTaskGap } from '../models';
import { ScanEvent } from '../models/scan-event.model';

export function calculateGapDurationMs(previousEvent: ScanEvent, currentEvent: ScanEvent): number {
  return currentEvent.eventTime.getTime() - previousEvent.eventTime.getTime();
}

export function isOffTaskGap(durationMs: number): boolean {
  return durationMs > OFF_TASK_GAP_THRESHOLD_MS;
}

export function createGapBetweenEvents(
  previousEvent: ScanEvent,
  currentEvent: ScanEvent,
): OffTaskGap {
  const durationMs = calculateGapDurationMs(previousEvent, currentEvent);

  return {
    associateName: currentEvent.associateName,
    loginId: currentEvent.loginId,
    startTime: previousEvent.eventTime,
    endTime: currentEvent.eventTime,
    durationMs,
    isOffTask: isOffTaskGap(durationMs),
  };
}

export function calculateGapsForAssociate(events: ScanEvent[]): OffTaskGap[] {
  if (events.length < 2) {
    return [];
  }

  const gaps: OffTaskGap[] = [];

  for (let index = 1; index < events.length; index += 1) {
    const previousEvent = events[index - 1];
    const currentEvent = events[index];

    if (!previousEvent || !currentEvent) {
      continue;
    }

    gaps.push(createGapBetweenEvents(previousEvent, currentEvent));
  }

  return gaps;
}
