import * as React from 'react';
import { Box, Typography } from '@mui/material';

import { DashboardMetrics } from '../../models';
import { formatDuration } from '../../utils';

import classes from './MetricsCards.module.scss';

type Props = {
  metrics: DashboardMetrics;
};

type MetricCardProps = {
  label: string;
  value: string;
};

function MetricCard({ label, value }: MetricCardProps): React.ReactElement {
  return (
    <Box className={classes['metric-card']}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4" component="p" className={classes['metric-value']}>
        {value}
      </Typography>
    </Box>
  );
}

export function MetricsCards({ metrics }: Props): React.ReactElement {
  return (
    <Box className={classes['metrics-grid']}>
      <MetricCard label="Associates" value={metrics.totalAssociates.toLocaleString()} />
      <MetricCard label="Scan events" value={metrics.totalScanEvents.toLocaleString()} />
      <MetricCard label="Off-task gaps" value={metrics.totalOffTaskGaps.toLocaleString()} />
      <MetricCard
        label="Off-task duration"
        value={formatDuration(metrics.totalOffTaskDurationMs)}
      />
    </Box>
  );
}
