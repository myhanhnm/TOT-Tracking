import { ActivityFilters } from '../models/activity-filters.model';

export const EMPTY_ACTIVITY_FILTERS: ActivityFilters = {
  date: null,
  associateName: '',
  loginId: '',
  function: '',
  process: '',
  unitClass: '',
  search: '',
};

export const TIMELINE_ZOOM_PRESETS = [
  { label: 'Full', value: 1 },
  { label: '2x', value: 2 },
  { label: '4x', value: 4 },
  { label: '8x', value: 8 },
] as const;

export type TimelineZoomPreset = (typeof TIMELINE_ZOOM_PRESETS)[number]['value'];
