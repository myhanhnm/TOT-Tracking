export const GAP_SEVERITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;

export type GapSeverity = (typeof GAP_SEVERITY)[keyof typeof GAP_SEVERITY];
