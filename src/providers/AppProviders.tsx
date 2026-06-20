'use client';

import * as React from 'react';

import { ActivityProvider } from 'src/context';
import { AppThemeProvider } from 'src/theme/AppThemeProvider';

type Props = {
  children: React.ReactNode;
};

export function AppProviders({ children }: Props): React.ReactElement {
  return (
    <AppThemeProvider>
      <ActivityProvider>{children}</ActivityProvider>
    </AppThemeProvider>
  );
}
