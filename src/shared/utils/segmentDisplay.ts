import { ActivitySegmentStatus } from 'src/modules/WorkforceActivity/models/activity-segment.model';

export const SEGMENT_STATUS_CSS_CLASS: Record<ActivitySegmentStatus, string> = {
  ACTIVE: 'segment--active',
  OFF_TASK: 'segment--off-task',
  PAID_BREAK: 'segment--paid-break',
  UNPAID_BREAK: 'segment--unpaid-break',
  MEETING: 'segment--meeting',
};

export function getSegmentCssClass(status: ActivitySegmentStatus): string {
  return SEGMENT_STATUS_CSS_CLASS[status];
}
