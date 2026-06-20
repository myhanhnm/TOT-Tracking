'use client';

import * as React from 'react';
import { Box, Container } from '@mui/material';

import { PublicHeader } from './components/PublicHeader';

import classes from './PublicLayout.module.scss';

type Props = {
  children: React.ReactNode;
};

export function PublicLayout({ children }: Props): React.ReactElement {
  return (
    <Box className={classes['layout']}>
      <Box className={classes['ambient']} aria-hidden />

      <PublicHeader />

      <Container maxWidth="xl" component="main" className={classes['main']}>
        {children}
      </Container>
    </Box>
  );
}
