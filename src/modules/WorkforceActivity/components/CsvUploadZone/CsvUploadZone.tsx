'use client';

import * as React from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';

import { useCsvUpload } from '../../hooks';

import classes from './CsvUploadZone.module.scss';

export function CsvUploadZone(): React.ReactElement {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const {
    isDragging,
    isProcessing,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
  } = useCsvUpload();

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box className={classes['upload-wrapper']}>
      <Box className={classes['intro']}>
        <Typography variant="overline" color="text.secondary">
          QuickSight export
        </Typography>
        <Typography variant="h2" component="h1">
          Upload warehouse scan data
        </Typography>
        <Typography variant="body1" color="text.secondary" className={classes['description']}>
          Drop a CSV file exported from AWS QuickSight. Parsing and analysis run entirely in your
          browser. Nothing is stored on a server.
        </Typography>
      </Box>

      <Box
        className={`${classes['drop-zone']} ${isDragging ? classes['drop-zone--active'] : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className={classes['file-input']}
          onChange={handleInputChange}
          disabled={isProcessing}
        />

        {isProcessing ? (
          <Box className={classes['processing']}>
            <CircularProgress size={40} thickness={4} />
            <Typography variant="body1" color="text.secondary">
              Parsing and analyzing CSV...
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h6" component="p" className={classes['drop-title']}>
              Drag and drop your CSV here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or choose a file from your device
            </Typography>
            <Button variant="contained" onClick={handleBrowseClick} className={classes['browse']}>
              Browse files
            </Button>
            <Typography variant="caption" color="text.secondary" className={classes['hint']}>
              Required columns match the standard QuickSight scan export
            </Typography>
          </>
        )}
      </Box>

      {error ? (
        <Alert severity="error" className={classes['error']}>
          {error}
        </Alert>
      ) : null}
    </Box>
  );
}
