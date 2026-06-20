import * as React from 'react';
import { Box, Typography } from '@mui/material';

import { OffTaskGapStats } from '../../models';
import { formatDuration } from 'src/shared/utils';

import classes from './OffTaskSummaryCards.module.scss';

type Props = {
  stats: OffTaskGapStats;
};

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps): React.ReactElement {
  return (
    <Box className={classes['card']}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" component="p" className={classes['value']}>
        {value}
      </Typography>
    </Box>
  );
}

export function OffTaskSummaryCards({ stats }: Props): React.ReactElement {
  return (
    <Box className={classes['summary-grid']}>
      <StatCard label="Total off-task time" value={formatDuration(stats.totalDurationMs)} />
      <StatCard label="Longest gap" value={formatDuration(stats.longestGapMs)} />
      <StatCard label="Average gap" value={formatDuration(stats.averageGapMs)} />
      <StatCard label="Gap count" value={stats.gapCount.toLocaleString()} />
    </Box>
  );
}
