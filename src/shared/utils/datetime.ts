import { format, isValid, parse, parseISO } from 'date-fns';

const EVENT_TIME_FORMATS = [
  'yyyy-MM-dd HH:mm:ss',
  'yyyy-MM-dd HH:mm:ss.SSS',
  'MM/dd/yyyy HH:mm:ss',
  'MM/dd/yyyy h:mm:ss a',
  'M/d/yyyy HH:mm:ss',
  'M/d/yyyy h:mm:ss a',
  'yyyy/MM/dd HH:mm:ss',
  'dd/MM/yyyy HH:mm:ss',
] as const;

export function parseEventTime(value: string): Date {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error('Event Time is required');
  }

  const isoParsed = parseISO(trimmed);
  if (isValid(isoParsed)) {
    return isoParsed;
  }

  for (const formatPattern of EVENT_TIME_FORMATS) {
    const parsed = parse(trimmed, formatPattern, new Date());
    if (isValid(parsed)) {
      return parsed;
    }
  }

  const fallback = new Date(trimmed);
  if (isValid(fallback)) {
    return fallback;
  }

  throw new Error(`Unable to parse Event Time: "${value}"`);
}

export function formatEventTime(date: Date): string {
  return format(date, 'HH:mm:ss');
}

export function formatEventDateTime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}
