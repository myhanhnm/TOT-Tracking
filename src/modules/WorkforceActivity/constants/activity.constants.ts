export const OFF_TASK_GAP_THRESHOLD_MS = 10 * 60 * 1000;

export const GAP_SEVERITY_THRESHOLDS_MS = {
  LOW_MAX: 15 * 60 * 1000,
  MEDIUM_MAX: 30 * 60 * 1000,
} as const;

export const REQUIRED_CSV_COLUMNS = [
  'LoginID',
  'Associate Name',
  'Function',
  'Unit Class',
  'Process',
  'Event Time',
  'ASIN',
  'Reference',
  'Size',
  'Unit Type',
  'Pack Flow',
  'Pick Process Path',
  'Units',
] as const;

export const CSV_COLUMN_MAP = {
  loginId: 'LoginID',
  associateName: 'Associate Name',
  function: 'Function',
  unitClass: 'Unit Class',
  process: 'Process',
  eventTime: 'Event Time',
  asin: 'ASIN',
  reference: 'Reference',
  size: 'Size',
  unitType: 'Unit Type',
  packFlow: 'Pack Flow',
  pickProcessPath: 'Pick Process Path',
  units: 'Units',
} as const;

export const ACCEPTED_CSV_MIME_TYPES = [
  'text/csv',
  'application/csv',
  'text/plain',
  'application/vnd.ms-excel',
] as const;

export const TOP_ASSOCIATES_CHART_LIMIT = 10;
