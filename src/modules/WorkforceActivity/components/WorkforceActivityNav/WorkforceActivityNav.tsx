'use client';

import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';

import { ACTIVITY_VIEWS } from 'src/modules/WorkforceActivity/constants/view.constants';
import { useActivityContext } from 'src/context';

import classes from './WorkforceActivityNav.module.scss';

export function WorkforceActivityNav(): React.ReactElement {
  const { view, fileName, analysis, goToUpload, goToDashboard } = useActivityContext();
  const hasData = analysis !== null;

  return (
    <Box className={classes['nav-row']}>
      <nav className={classes['nav']}>
        <Button
          onClick={goToUpload}
          variant={view === ACTIVITY_VIEWS.UPLOAD ? 'contained' : 'text'}
          className={classes['nav-button']}
          size="small"
        >
          Upload
        </Button>
        <Button
          onClick={goToDashboard}
          variant={
            view === ACTIVITY_VIEWS.DASHBOARD || view === ACTIVITY_VIEWS.ASSOCIATE
              ? 'contained'
              : 'text'
          }
          className={classes['nav-button']}
          size="small"
          disabled={!hasData}
        >
          Dashboard
        </Button>
      </nav>

      {fileName && view !== ACTIVITY_VIEWS.UPLOAD ? (
        <Typography variant="caption" className={classes['file-meta']}>
          Source: {fileName}
        </Typography>
      ) : null}
    </Box>
  );
}
