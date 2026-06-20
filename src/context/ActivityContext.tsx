'use client';

import * as React from 'react';

import { EMPTY_ACTIVITY_FILTERS, DEFAULT_SCHEDULE_BLOCKS } from 'src/modules/WorkforceActivity/constants';
import { ActivityView, ACTIVITY_VIEWS } from 'src/modules/WorkforceActivity/constants/view.constants';
import { ActivityFilterOptions, ActivityFilters } from 'src/modules/WorkforceActivity/models/activity-filters.model';
import { ActivityAnalysisResult } from 'src/modules/WorkforceActivity/models';
import { ScheduleBlock } from 'src/modules/WorkforceActivity/models/schedule-block.model';
import {
  ActivityAnalysisService,
  ActivityFilterService,
  ScheduleBlockStorageService,
} from 'src/shared/services';

type ActivityContextValue = {
  analysis: ActivityAnalysisResult | null;
  fileName: string | null;
  isLoading: boolean;
  error: string | null;
  view: ActivityView;
  selectedLoginId: string | null;
  filters: ActivityFilters;
  filterOptions: ActivityFilterOptions | null;
  filteredAnalysis: ActivityAnalysisResult | null;
  hasActiveFilters: boolean;
  scheduleBlocks: ScheduleBlock[];
  setAnalysis: (analysis: ActivityAnalysisResult, fileName: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: ActivityFilters) => void;
  updateFilter: <K extends keyof ActivityFilters>(key: K, value: ActivityFilters[K]) => void;
  resetFilters: () => void;
  setScheduleBlocks: (blocks: ScheduleBlock[]) => void;
  addScheduleBlock: (block: Omit<ScheduleBlock, 'id'>) => void;
  updateScheduleBlock: (id: string, updates: Partial<Omit<ScheduleBlock, 'id'>>) => void;
  deleteScheduleBlock: (id: string) => void;
  resetScheduleBlocks: () => void;
  clearActivityData: () => void;
  goToUpload: () => void;
  goToDashboard: () => void;
  openAssociate: (loginId: string) => void;
};

const ActivityContext = React.createContext<ActivityContextValue | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

function loadInitialScheduleBlocks(): ScheduleBlock[] {
  if (typeof window === 'undefined') {
    return DEFAULT_SCHEDULE_BLOCKS;
  }

  return ScheduleBlockStorageService.load();
}

export function ActivityProvider({ children }: Props): React.ReactElement {
  const [analysis, setAnalysisState] = React.useState<ActivityAnalysisResult | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [view, setView] = React.useState<ActivityView>(ACTIVITY_VIEWS.UPLOAD);
  const [selectedLoginId, setSelectedLoginId] = React.useState<string | null>(null);
  const [filters, setFiltersState] = React.useState<ActivityFilters>(EMPTY_ACTIVITY_FILTERS);
  const [scheduleBlocks, setScheduleBlocksState] =
    React.useState<ScheduleBlock[]>(loadInitialScheduleBlocks);
  const [isScheduleHydrated, setIsScheduleHydrated] = React.useState(
    () => typeof window !== 'undefined',
  );

  React.useEffect(() => {
    if (isScheduleHydrated) {
      return;
    }

    setScheduleBlocksState(ScheduleBlockStorageService.load());
    setIsScheduleHydrated(true);
  }, [isScheduleHydrated]);

  React.useEffect(() => {
    if (!isScheduleHydrated) {
      return;
    }

    ScheduleBlockStorageService.save(scheduleBlocks);
  }, [scheduleBlocks, isScheduleHydrated]);

  const filterOptions = React.useMemo(() => {
    if (!analysis) {
      return null;
    }

    return ActivityFilterService.extractFilterOptions(analysis.scanEvents);
  }, [analysis]);

  const filteredAnalysis = React.useMemo(() => {
    if (!analysis) {
      return null;
    }

    const filteredEvents = ActivityFilterService.applyFilters(analysis.scanEvents, filters);
    return ActivityAnalysisService.analyze(filteredEvents, scheduleBlocks);
  }, [analysis, filters, scheduleBlocks]);

  const hasActiveFilters = React.useMemo(
    () => ActivityFilterService.hasActiveFilters(filters),
    [filters],
  );

  const setAnalysis = React.useCallback((nextAnalysis: ActivityAnalysisResult, nextFileName: string) => {
    setAnalysisState(nextAnalysis);
    setFileName(nextFileName);
    setError(null);
    setFiltersState(EMPTY_ACTIVITY_FILTERS);
    setView(ACTIVITY_VIEWS.DASHBOARD);
    setSelectedLoginId(null);
  }, []);

  const setLoading = React.useCallback((nextLoading: boolean) => {
    setIsLoading(nextLoading);
  }, []);

  const setFilters = React.useCallback((nextFilters: ActivityFilters) => {
    setFiltersState(nextFilters);
  }, []);

  const updateFilter = React.useCallback(
    <K extends keyof ActivityFilters>(key: K, value: ActivityFilters[K]) => {
      setFiltersState((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const resetFilters = React.useCallback(() => {
    setFiltersState(EMPTY_ACTIVITY_FILTERS);
  }, []);

  const setScheduleBlocks = React.useCallback((blocks: ScheduleBlock[]) => {
    setScheduleBlocksState(blocks);
  }, []);

  const addScheduleBlock = React.useCallback((block: Omit<ScheduleBlock, 'id'>) => {
    setScheduleBlocksState((current) => [
      ...current,
      { ...block, id: ScheduleBlockStorageService.createId() },
    ]);
  }, []);

  const updateScheduleBlock = React.useCallback(
    (id: string, updates: Partial<Omit<ScheduleBlock, 'id'>>) => {
      setScheduleBlocksState((current) =>
        current.map((block) => (block.id === id ? { ...block, ...updates } : block)),
      );
    },
    [],
  );

  const deleteScheduleBlock = React.useCallback((id: string) => {
    setScheduleBlocksState((current) => current.filter((block) => block.id !== id));
  }, []);

  const resetScheduleBlocks = React.useCallback(() => {
    setScheduleBlocksState(DEFAULT_SCHEDULE_BLOCKS);
  }, []);

  const clearActivityData = React.useCallback(() => {
    setAnalysisState(null);
    setFileName(null);
    setError(null);
    setIsLoading(false);
    setFiltersState(EMPTY_ACTIVITY_FILTERS);
    setView(ACTIVITY_VIEWS.UPLOAD);
    setSelectedLoginId(null);
  }, []);

  const goToUpload = React.useCallback(() => {
    setView(ACTIVITY_VIEWS.UPLOAD);
    setSelectedLoginId(null);
  }, []);

  const goToDashboard = React.useCallback(() => {
    setView(ACTIVITY_VIEWS.DASHBOARD);
    setSelectedLoginId(null);
  }, []);

  const openAssociate = React.useCallback((loginId: string) => {
    setSelectedLoginId(loginId);
    setView(ACTIVITY_VIEWS.ASSOCIATE);
  }, []);

  const value = React.useMemo(
    () => ({
      analysis,
      fileName,
      isLoading,
      error,
      view,
      selectedLoginId,
      filters,
      filterOptions,
      filteredAnalysis,
      hasActiveFilters,
      scheduleBlocks,
      setAnalysis,
      setLoading,
      setError,
      setFilters,
      updateFilter,
      resetFilters,
      setScheduleBlocks,
      addScheduleBlock,
      updateScheduleBlock,
      deleteScheduleBlock,
      resetScheduleBlocks,
      clearActivityData,
      goToUpload,
      goToDashboard,
      openAssociate,
    }),
    [
      analysis,
      fileName,
      isLoading,
      error,
      view,
      selectedLoginId,
      filters,
      filterOptions,
      filteredAnalysis,
      hasActiveFilters,
      scheduleBlocks,
      setAnalysis,
      setLoading,
      resetFilters,
      setScheduleBlocks,
      addScheduleBlock,
      updateScheduleBlock,
      deleteScheduleBlock,
      resetScheduleBlocks,
      clearActivityData,
      goToUpload,
      goToDashboard,
      openAssociate,
      setFilters,
      updateFilter,
    ],
  );

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivityContext(): ActivityContextValue {
  const context = React.useContext(ActivityContext);

  if (!context) {
    throw new Error('useActivityContext must be used inside ActivityProvider');
  }

  return context;
}
