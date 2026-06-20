'use client';

import * as React from 'react';
import { Box } from '@mui/material';

import { ChartDatum } from '../../models';
import { BarChartPanel } from '../BarChartPanel';

import classes from './WorkforceCharts.module.scss';

type Props = {
  topOffTaskChart: ChartDatum[];
  topScanVolumeChart: ChartDatum[];
  utilizationDistribution: ChartDatum[];
  gapDurationDistribution: ChartDatum[];
};

export function WorkforceCharts({
  topOffTaskChart,
  topScanVolumeChart,
  utilizationDistribution,
  gapDurationDistribution,
}: Props): React.ReactElement {
  return (
    <Box className={classes['charts-grid']}>
      <BarChartPanel
        title="Top 10 off-task associates"
        data={topOffTaskChart}
        valueLabel="Off-task time (minutes)"
      />
      <BarChartPanel
        title="Top 10 scan volume"
        data={topScanVolumeChart}
        valueLabel="Scans"
      />
      <BarChartPanel
        title="Utilization distribution"
        data={utilizationDistribution}
        valueLabel="Associates"
      />
      <BarChartPanel
        title="Gap duration distribution"
        data={gapDurationDistribution}
        valueLabel="Gaps"
      />
    </Box>
  );
}
