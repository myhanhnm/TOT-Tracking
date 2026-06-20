import * as React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

type Props = {
  message?: string;
};

export function LoadingState({ message = 'Loading...' }: Props): React.ReactElement {
  return (
    <Box className="flex flex-col items-center justify-center gap-4 py-20">
      <CircularProgress size={36} thickness={4} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
