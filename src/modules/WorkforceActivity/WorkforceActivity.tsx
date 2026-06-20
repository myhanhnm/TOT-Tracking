'use client';

import * as React from 'react';
import { Box } from '@mui/material';

import { AppShell } from 'src/layouts/AppShell';

import { DashboardFilters } from './components';
import { ACTIVITY_VIEWS } from './constants/view.constants';
import { useActivityContext } from './context';
import { WorkforceActivityAssociateDetail } from './WorkforceActivityAssociateDetail';
import { WorkforceActivityDashboard } from './WorkforceActivityDashboard';
import { WorkforceActivityUpload } from './WorkforceActivityUpload';
import classes from './workforce-activity.module.scss';

export function WorkforceActivity(): React.ReactElement {
  const { view, selectedLoginId, analysis, filterOptions } = useActivityContext();

  const content = React.useMemo(() => {
    if (view === ACTIVITY_VIEWS.UPLOAD) {
      return <WorkforceActivityUpload />;
    }

    if (view === ACTIVITY_VIEWS.ASSOCIATE && selectedLoginId) {
      return <WorkforceActivityAssociateDetail loginId={selectedLoginId} />;
    }

    return <WorkforceActivityDashboard />;
  }, [view, selectedLoginId]);

  const showFilters =
    analysis !== null && filterOptions !== null && view !== ACTIVITY_VIEWS.UPLOAD;

  return (
    <AppShell>
      <Box className={classes['content-stack']}>
        {showFilters ? <DashboardFilters filterOptions={filterOptions} /> : null}
        {content}
      </Box>
    </AppShell>
  );
}
