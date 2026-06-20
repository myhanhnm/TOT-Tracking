'use client';

import * as React from 'react';
import { Box, Button, ButtonGroup, Tooltip, Typography } from '@mui/material';

import {
  ACTIVITY_SEGMENT_LABELS,
  ACTIVITY_SEGMENT_SOURCE_LABELS,
} from '../../constants/segment.constants';
import { TIMELINE_ZOOM_PRESETS, TimelineZoomPreset } from '../../constants/filter.constants';
import { ShiftUtilization, TimelineSegment } from '../../models';
import {
  formatDuration,
  formatEventDateTime,
  formatUtilizationPercent,
  getSegmentCssClass,
} from 'src/shared/utils';

import classes from './ActivityTimeline.module.scss';

type Props = {
  shiftUtilization: ShiftUtilization;
};

const LEGEND_ITEMS = [
  { status: 'ACTIVE' as const, className: 'legend-swatch--active', label: 'Active' },
  { status: 'OFF_TASK' as const, className: 'legend-swatch--off-task', label: 'Off Task' },
  { status: 'PAID_BREAK' as const, className: 'legend-swatch--paid-break', label: 'Paid Break' },
  { status: 'UNPAID_BREAK' as const, className: 'legend-swatch--unpaid-break', label: 'Unpaid Break' },
  { status: 'MEETING' as const, className: 'legend-swatch--meeting', label: 'Meeting' },
];

type SegmentTooltipProps = {
  segment: TimelineSegment;
};

function SegmentTooltipContent({ segment }: SegmentTooltipProps): React.ReactElement {
  return (
    <Box className={classes['tooltip-content']}>
      <Typography variant="caption" component="p">
        <strong>Status:</strong> {ACTIVITY_SEGMENT_LABELS[segment.status]}
      </Typography>
      <Typography variant="caption" component="p">
        <strong>Label:</strong> {segment.label}
      </Typography>
      <Typography variant="caption" component="p">
        <strong>Start:</strong> {formatEventDateTime(segment.startTime)}
      </Typography>
      <Typography variant="caption" component="p">
        <strong>End:</strong> {formatEventDateTime(segment.endTime)}
      </Typography>
      <Typography variant="caption" component="p">
        <strong>Duration:</strong> {formatDuration(segment.durationMs)}
      </Typography>
      <Typography variant="caption" component="p">
        <strong>Source:</strong> {ACTIVITY_SEGMENT_SOURCE_LABELS[segment.source]}
      </Typography>
    </Box>
  );
}

type SummaryStatProps = {
  label: string;
  value: string;
  tone?: 'active' | 'off-task' | 'paid-break' | 'unpaid-break' | 'meeting' | 'default';
};

function SummaryStat({ label, value, tone = 'default' }: SummaryStatProps): React.ReactElement {
  const toneClass = tone !== 'default' ? classes[`summary-stat--${tone}`] : classes['summary-stat--default'];

  return (
    <Box className={`${classes['summary-stat']} ${toneClass}`}>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" component="p" className={classes['summary-value']}>
        {value}
      </Typography>
    </Box>
  );
}

export function ActivityTimeline({ shiftUtilization }: Props): React.ReactElement {
  const [zoom, setZoom] = React.useState<TimelineZoomPreset>(1);
  const {
    firstScan,
    lastScan,
    totalShiftTimeMs,
    activeTimeMs,
    offTaskTimeMs,
    paidBreakTimeMs,
    unpaidBreakTimeMs,
    meetingTimeMs,
    utilizationPercent,
    segments,
  } = shiftUtilization;

  const trackWidthPercent = zoom * 100;

  return (
    <Box className={classes['wrapper']}>
      <Box className={classes['header']}>
        <Typography variant="h5" component="h2">
          Activity timeline
        </Typography>
        <Box className={classes['legend']} aria-label="Timeline legend">
          {LEGEND_ITEMS.map((item) => (
            <span key={item.status} className={classes['legend-item']}>
              <span
                className={`${classes['legend-swatch']} ${classes[item.className]}`}
                aria-hidden
              />
              {item.label}
            </span>
          ))}
        </Box>
      </Box>

      <Box className={classes['zoom-controls']}>
        <Typography variant="caption" color="text.secondary" className={classes['zoom-label-text']}>
          Zoom
        </Typography>
        <ButtonGroup size="small" variant="outlined" aria-label="Timeline zoom presets">
          {TIMELINE_ZOOM_PRESETS.map((preset) => (
            <Button
              key={preset.value}
              onClick={() => setZoom(preset.value)}
              variant={zoom === preset.value ? 'contained' : 'outlined'}
            >
              {preset.label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      <Box className={classes['scroll-container']}>
        <Box className={classes['track']} style={{ width: `${trackWidthPercent}%` }}>
          {totalShiftTimeMs === 0 ? (
            <Box className={`${classes['segment']} ${classes['segment--active']}`} style={{ width: '100%' }} />
          ) : (
            segments.map((segment) => {
              const widthPercent = (segment.durationMs / totalShiftTimeMs) * 100;
              const segmentClass = getSegmentCssClass(segment.status);

              return (
                <Tooltip
                  key={segment.id}
                  title={<SegmentTooltipContent segment={segment} />}
                  arrow
                  placement="top"
                  enterDelay={200}
                >
                  <Box
                    className={`${classes['segment']} ${classes[segmentClass]}`}
                    style={{ width: `${widthPercent}%` }}
                    role="img"
                    aria-label={`${segment.label}, ${formatDuration(segment.durationMs)}`}
                  />
                </Tooltip>
              );
            })
          )}
        </Box>
      </Box>

      <Box className={classes['time-axis']}>
        <Typography variant="caption" className={classes['axis-label']}>
          {formatEventDateTime(firstScan)}
        </Typography>
        <Typography variant="caption" className={classes['axis-label']}>
          {formatEventDateTime(lastScan)}
        </Typography>
      </Box>

      <Box className={classes['summary-grid']}>
        <SummaryStat label="Active time" value={formatDuration(activeTimeMs)} tone="active" />
        <SummaryStat label="Off-task time" value={formatDuration(offTaskTimeMs)} tone="off-task" />
        <SummaryStat label="Paid break" value={formatDuration(paidBreakTimeMs)} tone="paid-break" />
        <SummaryStat label="Unpaid break" value={formatDuration(unpaidBreakTimeMs)} tone="unpaid-break" />
        <SummaryStat label="Meeting" value={formatDuration(meetingTimeMs)} tone="meeting" />
        <SummaryStat
          label="Utilization"
          value={formatUtilizationPercent(utilizationPercent)}
          tone="default"
        />
      </Box>
    </Box>
  );
}
