'use client';

import * as React from 'react';
import { Box } from '@mui/material';

import { CsvUploadZone } from './components';
import classes from './workforce-activity.module.scss';

export function WorkforceActivityUpload(): React.ReactElement {
  return (
    <Box className={classes['page-wrapper']}>
      <CsvUploadZone />
    </Box>
  );
}
