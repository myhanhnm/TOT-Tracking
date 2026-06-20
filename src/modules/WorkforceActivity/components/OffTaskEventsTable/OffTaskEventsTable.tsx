'use client';

import * as React from 'react';
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { GAP_SEVERITY, GapSeverity, OffTaskGap } from '../../models';
import { formatDuration, formatEventDateTime, getGapSeverity } from '../../utils';

import classes from './OffTaskEventsTable.module.scss';

type Props = {
  gaps: OffTaskGap[];
};

const SEVERITY_CHIP_CLASS: Record<GapSeverity, string> = {
  [GAP_SEVERITY.LOW]: classes['severity-low'] ?? '',
  [GAP_SEVERITY.MEDIUM]: classes['severity-medium'] ?? '',
  [GAP_SEVERITY.HIGH]: classes['severity-high'] ?? '',
};

export function OffTaskEventsTable({ gaps }: Props): React.ReactElement {
  const sortedGaps = React.useMemo(() => {
    return [...gaps].sort((left, right) => left.startTime.getTime() - right.startTime.getTime());
  }, [gaps]);

  return (
    <Box className={classes['wrapper']}>
      <Typography variant="h5" component="h2" className={classes['title']}>
        Off-task events
      </Typography>

      {sortedGaps.length === 0 ? (
        <Typography variant="body2" color="text.secondary" className={classes['empty']}>
          No off-task gaps detected for this associate.
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Start time</TableCell>
                <TableCell>End time</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell>Severity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedGaps.map((gap, index) => {
                const severity = getGapSeverity(gap.durationMs);

                return (
                  <TableRow key={`${gap.startTime.getTime()}-${gap.endTime.getTime()}-${index}`}>
                    <TableCell className={classes['mono']}>
                      {formatEventDateTime(gap.startTime)}
                    </TableCell>
                    <TableCell className={classes['mono']}>
                      {formatEventDateTime(gap.endTime)}
                    </TableCell>
                    <TableCell align="right" className={classes['mono']}>
                      {formatDuration(gap.durationMs)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={severity}
                        size="small"
                        className={`${classes['severity-chip']} ${SEVERITY_CHIP_CLASS[severity]}`}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
