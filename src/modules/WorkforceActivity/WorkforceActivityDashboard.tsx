'use client';

import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';

import { EmptyState, LoadingState } from 'src/components';

import {
  AssociateRankings,
  AssociateTable,
  ScheduleBlocksManager,
  WorkforceCharts,
  WorkforceMetricsCards,
} from './components';
import { useFilteredAnalysis, useWorkforceDashboardData } from './hooks';
import { useActivityContext } from './context';
import classes from './workforce-activity.module.scss';

export function WorkforceActivityDashboard(): React.ReactElement {
  const { goToUpload } = useActivityContext();
  const { isLoading, hasData } = useFilteredAnalysis();
  const {
    metrics,
    associates,
    topOffTaskChart,
    topScanVolumeChart,
    utilizationDistribution,
    gapDurationDistribution,
    topOffTaskAssociates,
    topUtilizedAssociates,
    topScanVolumeAssociates,
    hasResults,
  } = useWorkforceDashboardData();

  if (isLoading) {
    return <LoadingState message="Analyzing activity data..." />;
  }

  if (!hasData || !metrics) {
    return (
      <Box className={classes['page-wrapper']}>
        <EmptyState
          title="No activity data loaded"
          description="Upload a CSV export from AWS QuickSight to analyze scan gaps and off-task periods."
          action={
            <Button onClick={goToUpload} variant="contained">
              Upload CSV
            </Button>
          }
        />
      </Box>
    );
  }

  return (
    <Box className={classes['page-wrapper']}>
      <Box className={classes['page-header']}>
        <Typography variant="h2" component="h1">
          Workforce dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" className={classes['lede']}>
          Identify off-task associates, review utilization, and drill into shift timelines. Gaps
          over 10 minutes between consecutive scans are flagged.
        </Typography>
      </Box>

      <WorkforceMetricsCards metrics={metrics} />
      <ScheduleBlocksManager />

      {!hasResults ? (
        <Box className={classes['filter-empty']}>
          <EmptyState
            title="No results for current filters"
            description="Try adjusting or clearing your filters to see workforce activity data."
          />
        </Box>
      ) : (
        <>
          <AssociateRankings
            topOffTaskAssociates={topOffTaskAssociates}
            topUtilizedAssociates={topUtilizedAssociates}
            topScanVolumeAssociates={topScanVolumeAssociates}
          />
          <WorkforceCharts
            topOffTaskChart={topOffTaskChart}
            topScanVolumeChart={topScanVolumeChart}
            utilizationDistribution={utilizationDistribution}
            gapDurationDistribution={gapDurationDistribution}
          />
          <AssociateTable associates={associates} />
        </>
      )}
    </Box>
  );
}
