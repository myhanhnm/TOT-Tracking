'use client';

import * as React from 'react';
import { Box, Button } from '@mui/material';

import { EmptyState, LoadingState } from 'src/components';

import {
  ActivityTimeline,
  AssociateDetailHeader,
  OffTaskEventsTable,
  OffTaskSummaryCards,
  ScheduleEventsTable,
} from './components';
import { useAssociateDetail } from './hooks';
import { useActivityContext } from './context';
import classes from './workforce-activity.module.scss';

type Props = {
  loginId: string;
};

export function WorkforceActivityAssociateDetail({ loginId }: Props): React.ReactElement {
  const { goToUpload, goToDashboard } = useActivityContext();
  const { summary, offTaskGaps, offTaskStats, scheduleSegments, shiftUtilization, isLoading, hasData } =
    useAssociateDetail({ loginId });

  if (isLoading) {
    return <LoadingState message="Loading associate details..." />;
  }

  if (!hasData) {
    return (
      <Box className={classes['page-wrapper']}>
        <EmptyState
          title="No activity data loaded"
          description="Upload a CSV file first to view associate details."
          action={
            <Button onClick={goToUpload} variant="contained">
              Upload CSV
            </Button>
          }
        />
      </Box>
    );
  }

  if (!summary) {
    return (
      <Box className={classes['page-wrapper']}>
        <EmptyState
          title="Associate not found"
          description="No activity data was found for this associate in the uploaded file."
          action={
            <Button onClick={goToDashboard} variant="contained">
              Back to dashboard
            </Button>
          }
        />
      </Box>
    );
  }

  return (
    <Box className={classes['page-wrapper']}>
      <Button onClick={goToDashboard} variant="text" className={classes['back-button']}>
        Back to dashboard
      </Button>

      <AssociateDetailHeader summary={summary} />
      {shiftUtilization ? <ActivityTimeline shiftUtilization={shiftUtilization} /> : null}
      <OffTaskSummaryCards stats={offTaskStats} />
      <ScheduleEventsTable segments={scheduleSegments} />
      <OffTaskEventsTable gaps={offTaskGaps} />
    </Box>
  );
}
