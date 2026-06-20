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

import { ChartDatum } from '../../models';

import classes from './BarChartPanel.module.scss';

const CHART_FILL = '#2F3437';

type Props = {
  title: string;
  data: ChartDatum[];
  valueLabel: string;
  emptyMessage?: string;
};

export function BarChartPanel({
  title,
  data,
  valueLabel,
  emptyMessage = 'No data for current filters',
}: Props): React.ReactElement {
  const hasData = data.some((datum) => datum.value > 0);

  return (
    <Box className={classes['chart-panel']}>
      <Typography variant="subtitle1" component="h3" className={classes['chart-title']}>
        {title}
      </Typography>

      {hasData ? (
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
      ) : (
        <Box className={classes['empty-chart']}>
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
