import * as React from 'react';
import { Box, Typography } from '@mui/material';

type Props = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({
  title = 'No data available',
  description = 'Upload a CSV file to get started.',
  action,
}: Props): React.ReactElement {
  return (
    <Box className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-line bg-surface px-6 py-16 text-center">
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" maxWidth={420}>
        {description}
      </Typography>
      {action}
    </Box>
  );
}
