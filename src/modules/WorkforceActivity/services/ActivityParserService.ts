import {
  ACCEPTED_CSV_MIME_TYPES,
  CSV_COLUMN_MAP,
  REQUIRED_CSV_COLUMNS,
} from '../constants';
import { CsvRow, ScanEvent } from '../models';
import { parseEventTime } from '../utils/datetime';

export type ParseCsvResult = {
  events: ScanEvent[];
};

export type ParseCsvError = {
  message: string;
};

export class ActivityParserService {
  static validateFileType(file: File): boolean {
    const extension = file.name.toLowerCase().endsWith('.csv');
    const mimeType = ACCEPTED_CSV_MIME_TYPES.includes(
      file.type as (typeof ACCEPTED_CSV_MIME_TYPES)[number],
    );

    return extension || mimeType || file.type === '';
  }

  static validateHeaders(headers: string[]): string | null {
    const normalizedHeaders = new Set(headers.map((header) => header.trim()));

    const missingColumns = REQUIRED_CSV_COLUMNS.filter(
      (column) => !normalizedHeaders.has(column),
    );

    if (missingColumns.length > 0) {
      return `Missing required columns: ${missingColumns.join(', ')}`;
    }

    return null;
  }

  static parseRows(rows: CsvRow[]): ParseCsvResult {
    const events: ScanEvent[] = [];

    rows.forEach((row, index) => {
      const rowNumber = index + 2;

      try {
        const event = ActivityParserService.mapRowToScanEvent(row);
        events.push(event);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown parsing error';
        throw new Error(`Row ${rowNumber}: ${message}`);
      }
    });

    return { events };
  }

  private static mapRowToScanEvent(row: CsvRow): ScanEvent {
    const loginId = ActivityParserService.getRequiredValue(row, CSV_COLUMN_MAP.loginId);
    const associateName = ActivityParserService.getRequiredValue(row, CSV_COLUMN_MAP.associateName);
    const eventTimeRaw = ActivityParserService.getRequiredValue(row, CSV_COLUMN_MAP.eventTime);
    const unitsRaw = ActivityParserService.getRequiredValue(row, CSV_COLUMN_MAP.units);

    const units = Number(unitsRaw);
    if (Number.isNaN(units)) {
      throw new Error(`Invalid Units value: "${unitsRaw}"`);
    }

    return {
      loginId,
      associateName,
      function: ActivityParserService.getOptionalValue(row, CSV_COLUMN_MAP.function),
      unitClass: ActivityParserService.getOptionalValue(row, CSV_COLUMN_MAP.unitClass),
      process: ActivityParserService.getOptionalValue(row, CSV_COLUMN_MAP.process),
      eventTime: parseEventTime(eventTimeRaw),
      asin: ActivityParserService.getOptionalValue(row, CSV_COLUMN_MAP.asin),
      reference: ActivityParserService.getOptionalValue(row, CSV_COLUMN_MAP.reference),
      size: ActivityParserService.getOptionalValue(row, CSV_COLUMN_MAP.size),
      unitType: ActivityParserService.getOptionalValue(row, CSV_COLUMN_MAP.unitType),
      packFlow: ActivityParserService.getOptionalValue(row, CSV_COLUMN_MAP.packFlow),
      pickProcessPath: ActivityParserService.getOptionalValue(row, CSV_COLUMN_MAP.pickProcessPath),
      units,
    };
  }

  private static getRequiredValue(row: CsvRow, columnName: string): string {
    const value = row[columnName]?.trim();

    if (!value) {
      throw new Error(`"${columnName}" is required`);
    }

    return value;
  }

  private static getOptionalValue(row: CsvRow, columnName: string): string {
    return row[columnName]?.trim() ?? '';
  }
}
