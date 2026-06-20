export const ACTIVITY_VIEWS = {
  UPLOAD: 'upload',
  DASHBOARD: 'dashboard',
  ASSOCIATE: 'associate',
} as const;

export type ActivityView = (typeof ACTIVITY_VIEWS)[keyof typeof ACTIVITY_VIEWS];
