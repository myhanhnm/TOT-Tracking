'use client';

import * as React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

import { ACTIVITY_VIEWS } from 'src/modules/WorkforceActivity/constants/view.constants';
import { useActivityContext } from 'src/modules/WorkforceActivity/context';

import classes from './AppShell.module.scss';

type Props = {
  children: React.ReactNode;
};

export function AppShell({ children }: Props): React.ReactElement {
  const { view, fileName, analysis, goToUpload, goToDashboard } = useActivityContext();
  const hasData = analysis !== null;

  return (
    <Box className={classes['shell']}>
      <Box className={classes['ambient']} aria-hidden />

      <header className={classes['header']}>
        <Container maxWidth="xl" className={classes['header-inner']}>
          <Box className={classes['brand-block']}>
            <Typography variant="h6" component="p" className={classes['brand']}>
              Workforce Activity
            </Typography>
            <Typography variant="body2" className={classes['tagline']}>
              Scan gap analysis from QuickSight exports
            </Typography>
          </Box>

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
        </Container>
      </header>

      <Container maxWidth="xl" component="main" className={classes['main']}>
        {fileName && view !== ACTIVITY_VIEWS.UPLOAD ? (
          <Typography variant="caption" className={classes['file-meta']}>
            Source: {fileName}
          </Typography>
        ) : null}
        {children}
      </Container>
    </Box>
  );
}
