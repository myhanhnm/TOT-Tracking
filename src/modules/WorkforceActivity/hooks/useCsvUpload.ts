'use client';

import * as React from 'react';
import Papa from 'papaparse';

import { useActivityContext } from 'src/context';
import { CsvRow } from '../models';
import { ActivityAnalysisService, ActivityParserService } from 'src/shared/services';

type UseCsvUploadReturn = {
  isDragging: boolean;
  isProcessing: boolean;
  error: string | null;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function useCsvUpload(): UseCsvUploadReturn {
  const { setAnalysis, setLoading, setError, error, scheduleBlocks } = useActivityContext();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const processFile = React.useCallback(
    (file: File) => {
      if (!ActivityParserService.validateFileType(file)) {
        setError('Invalid file type. Please upload a CSV file.');
        return;
      }

      setIsProcessing(true);
      setLoading(true);
      setError(null);

      Papa.parse<CsvRow>(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          try {
            const headers = results.meta.fields ?? [];
            const headerError = ActivityParserService.validateHeaders(headers);

            if (headerError) {
              throw new Error(headerError);
            }

            const { events } = ActivityParserService.parseRows(results.data);
            const analysis = ActivityAnalysisService.analyze(events, scheduleBlocks);

            setAnalysis(analysis, file.name);
          } catch (parseError) {
            const message =
              parseError instanceof Error ? parseError.message : 'Failed to parse CSV file';
            setError(message);
          } finally {
            setIsProcessing(false);
            setLoading(false);
          }
        },
        error: (parseError) => {
          setError(parseError.message);
          setIsProcessing(false);
          setLoading(false);
        },
      });
    },
    [setAnalysis, setError, setLoading, scheduleBlocks],
  );

  const handleDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);

      const file = event.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile],
  );

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile],
  );

  return {
    isDragging,
    isProcessing,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
  };
}
