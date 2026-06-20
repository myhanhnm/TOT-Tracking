'use client';

import * as React from 'react';
import { Box, Container, Typography } from '@mui/material';

import classes from './PublicHeader.module.scss';

export function PublicHeader(): React.ReactElement {
  return (
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
      </Container>
    </header>
  );
}
