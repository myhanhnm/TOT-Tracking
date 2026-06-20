export function calculateUtilizationPercent(activeTimeMs: number, offTaskTimeMs: number): number {
  const totalTimeMs = activeTimeMs + offTaskTimeMs;

  if (totalTimeMs <= 0) {
    return 0;
  }

  return Math.round((activeTimeMs / totalTimeMs) * 1000) / 10;
}

export function formatUtilizationPercent(percent: number): string {
  if (!Number.isFinite(percent)) {
    return '0.0%';
  }

  return `${percent.toFixed(1)}%`;
}

export function calculateScanRatePerHour(totalScans: number, shiftDurationMs: number): number {
  if (shiftDurationMs <= 0 || totalScans <= 0) {
    return 0;
  }

  const hours = shiftDurationMs / (1000 * 60 * 60);
  return Math.round((totalScans / hours) * 10) / 10;
}
