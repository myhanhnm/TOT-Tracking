import * as React from 'react';
import { Box, Typography } from '@mui/material';

import { AssociateSummary } from '../../models';
import { formatDuration, formatUtilizationPercent } from '../../utils';

import classes from './AssociateDetailHeader.module.scss';

type Props = {
  summary: AssociateSummary;
};

export function AssociateDetailHeader({ summary }: Props): React.ReactElement {
  return (
    <Box className={classes['header']}>
      <Typography variant="h2" component="h1">
        {summary.associateName}
      </Typography>
      <Typography variant="body2" color="text.secondary" className={classes['login']}>
        Login ID {summary.loginId} · {summary.totalScans.toLocaleString()} scans
      </Typography>
      <Box className={classes['stats-row']}>
        <Typography variant="body2" color="text.secondary">
          Utilization {formatUtilizationPercent(summary.utilizationPercent)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Active {formatDuration(summary.activeTimeMs)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Off-task {formatDuration(summary.totalOffTaskDurationMs)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Paid break {formatDuration(summary.paidBreakTimeMs)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Unpaid break {formatDuration(summary.unpaidBreakTimeMs)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Meeting {formatDuration(summary.meetingTimeMs)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {summary.scanRatePerHour.toFixed(1)} scans/hr
        </Typography>
      </Box>
    </Box>
  );
}
