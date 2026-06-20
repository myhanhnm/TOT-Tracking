'use client';

import * as React from 'react';
import { Box, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { TOP_ASSOCIATES_CHART_LIMIT } from '../../constants';
import { AssociateSummary } from '../../models';
import { durationToMinutes, formatDuration } from 'src/shared/utils';

import classes from './ActivityCharts.module.scss';

type Props = {
  associates: AssociateSummary[];
};

type ChartDatum = {
  name: string;
  value: number;
  displayValue: string;
};

const CHART_FILL = '#2F3437';

function truncateName(name: string, maxLength = 14): string {
  if (name.length <= maxLength) {
    return name;
  }

  return `${name.slice(0, maxLength)}…`;
}

function buildOffTaskChartData(associates: AssociateSummary[]): ChartDatum[] {
  return [...associates]
    .sort((left, right) => right.totalOffTaskDurationMs - left.totalOffTaskDurationMs)
    .slice(0, TOP_ASSOCIATES_CHART_LIMIT)
    .map((associate) => ({
      name: truncateName(associate.associateName),
      value: durationToMinutes(associate.totalOffTaskDurationMs),
      displayValue: formatDuration(associate.totalOffTaskDurationMs),
    }));
}

function buildScanCountChartData(associates: AssociateSummary[]): ChartDatum[] {
  return [...associates]
    .sort((left, right) => right.totalScans - left.totalScans)
    .slice(0, TOP_ASSOCIATES_CHART_LIMIT)
    .map((associate) => ({
      name: truncateName(associate.associateName),
      value: associate.totalScans,
      displayValue: associate.totalScans.toLocaleString(),
    }));
}

function buildDurationDistribution(associates: AssociateSummary[]): ChartDatum[] {
  const buckets = [
    { label: '0-15m', min: 0, max: 15 },
    { label: '15-30m', min: 15, max: 30 },
    { label: '30-60m', min: 30, max: 60 },
    { label: '1-2h', min: 60, max: 120 },
    { label: '2h+', min: 120, max: Infinity },
  ];

  return buckets.map((bucket) => {
    const count = associates.filter((associate) => {
      const minutes = durationToMinutes(associate.totalOffTaskDurationMs);
      return minutes >= bucket.min && minutes < bucket.max;
    }).length;

    return {
      name: bucket.label,
      value: count,
      displayValue: count.toLocaleString(),
    };
  });
}

type ChartPanelProps = {
  title: string;
  data: ChartDatum[];
  valueLabel: string;
};

function ChartPanel({ title, data, valueLabel }: ChartPanelProps): React.ReactElement {
  return (
    <Box className={classes['chart-panel']}>
      <Typography variant="subtitle1" component="h3" className={classes['chart-title']}>
        {title}
      </Typography>
      <Box className={classes['chart-container']}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
            <CartesianGrid stroke="#EAEAEA" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              interval={0}
              height={60}
              tick={{ fontSize: 11, fill: '#787774' }}
              axisLine={{ stroke: '#EAEAEA' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#787774' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                border: '1px solid #EAEAEA',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(17, 17, 17, 0.04)',
              }}
              formatter={(_value, _name, item) => {
                const payload = item.payload as ChartDatum;
                return [payload.displayValue, valueLabel];
              }}
            />
            <Bar dataKey="value" fill={CHART_FILL} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export function ActivityCharts({ associates }: Props): React.ReactElement {
  const offTaskData = React.useMemo(() => buildOffTaskChartData(associates), [associates]);
  const scanCountData = React.useMemo(() => buildScanCountChartData(associates), [associates]);
  const distributionData = React.useMemo(() => buildDurationDistribution(associates), [associates]);

  return (
    <Box className={classes['charts-grid']}>
      <ChartPanel
        title="Top associates by off-task duration"
        data={offTaskData}
        valueLabel="Duration (minutes)"
      />
      <ChartPanel
        title="Top associates by scan count"
        data={scanCountData}
        valueLabel="Scans"
      />
      <ChartPanel
        title="Off-task duration distribution"
        data={distributionData}
        valueLabel="Associates"
      />
    </Box>
  );
}
