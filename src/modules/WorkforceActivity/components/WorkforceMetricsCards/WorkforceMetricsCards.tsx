import * as React from 'react';
import { Box, Typography } from '@mui/material';

import { WorkforceMetrics } from '../../models';
import { formatDuration, formatUtilizationPercent } from '../../utils';

import classes from './WorkforceMetricsCards.module.scss';

type Props = {
  metrics: WorkforceMetrics;
};

type MetricCardProps = {
  label: string;
  value: string;
  tone?: 'default' | 'highlight' | 'warning' | 'paid-break' | 'unpaid-break' | 'meeting';
};

function MetricCard({ label, value, tone = 'default' }: MetricCardProps): React.ReactElement {
  const toneClass =
    tone === 'highlight'
      ? classes['metric-card--highlight']
      : tone === 'warning'
        ? classes['metric-card--warning']
        : tone === 'paid-break'
          ? classes['metric-card--paid-break']
          : tone === 'unpaid-break'
            ? classes['metric-card--unpaid-break']
            : tone === 'meeting'
              ? classes['metric-card--meeting']
              : '';

  return (
    <Box className={`${classes['metric-card']} ${toneClass}`}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" component="p" className={classes['metric-value']}>
        {value}
      </Typography>
    </Box>
  );
}

export function WorkforceMetricsCards({ metrics }: Props): React.ReactElement {
  return (
    <Box className={classes['metrics-grid']}>
      <MetricCard label="Active time" value={formatDuration(metrics.totalActiveTimeMs)} tone="highlight" />
      <MetricCard
        label="Off-task time"
        value={formatDuration(metrics.totalOffTaskDurationMs)}
        tone="warning"
      />
      <MetricCard
        label="Paid break"
        value={formatDuration(metrics.totalPaidBreakTimeMs)}
        tone="paid-break"
      />
      <MetricCard
        label="Unpaid break"
        value={formatDuration(metrics.totalUnpaidBreakTimeMs)}
        tone="unpaid-break"
      />
      <MetricCard
        label="Meeting"
        value={formatDuration(metrics.totalMeetingTimeMs)}
        tone="meeting"
      />
      <MetricCard
        label="Utilization"
        value={formatUtilizationPercent(metrics.utilizationPercent)}
      />
    </Box>
  );
}
