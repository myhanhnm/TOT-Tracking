'use client';

import * as React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { ACTIVITY_SEGMENT_LABELS } from '../../constants/segment.constants';
import { TimelineSegment } from '../../models';
import { formatDuration, formatEventDateTime } from '../../utils';

import classes from './ScheduleEventsTable.module.scss';

type Props = {
  segments: TimelineSegment[];
};

export function ScheduleEventsTable({ segments }: Props): React.ReactElement {
  const sortedSegments = React.useMemo(() => {
    return [...segments].sort(
      (left, right) => left.startTime.getTime() - right.startTime.getTime(),
    );
  }, [segments]);

  return (
    <Box className={classes['wrapper']}>
      <Typography variant="h5" component="h2" className={classes['title']}>
        Schedule events
      </Typography>

      {sortedSegments.length === 0 ? (
        <Box className={classes['empty-state']}>
          <Typography variant="body2" color="text.secondary">
            No scheduled break or meeting segments overlap this associate&apos;s shift.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>Start time</TableCell>
                <TableCell>End time</TableCell>
                <TableCell align="right">Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedSegments.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell>{ACTIVITY_SEGMENT_LABELS[segment.status]}</TableCell>
                  <TableCell>{segment.label}</TableCell>
                  <TableCell className={classes['mono']}>
                    {formatEventDateTime(segment.startTime)}
                  </TableCell>
                  <TableCell className={classes['mono']}>
                    {formatEventDateTime(segment.endTime)}
                  </TableCell>
                  <TableCell align="right" className={classes['mono']}>
                    {formatDuration(segment.durationMs)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
