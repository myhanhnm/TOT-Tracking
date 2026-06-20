import * as React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
}: Props): React.ReactElement {
  return (
    <Box className="py-8">
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}
