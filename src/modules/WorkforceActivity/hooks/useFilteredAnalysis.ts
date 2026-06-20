import { useActivityContext } from '../context';

type UseFilteredAnalysisReturn = {
  analysis: ReturnType<typeof useActivityContext>['filteredAnalysis'];
  rawAnalysis: ReturnType<typeof useActivityContext>['analysis'];
  filters: ReturnType<typeof useActivityContext>['filters'];
  filterOptions: ReturnType<typeof useActivityContext>['filterOptions'];
  hasActiveFilters: boolean;
  hasData: boolean;
  isLoading: boolean;
  updateFilter: ReturnType<typeof useActivityContext>['updateFilter'];
  resetFilters: ReturnType<typeof useActivityContext>['resetFilters'];
};

export function useFilteredAnalysis(): UseFilteredAnalysisReturn {
  const {
    filteredAnalysis,
    analysis,
    filters,
    filterOptions,
    hasActiveFilters,
    isLoading,
    updateFilter,
    resetFilters,
  } = useActivityContext();

  return {
    analysis: filteredAnalysis,
    rawAnalysis: analysis,
    filters,
    filterOptions,
    hasActiveFilters,
    hasData: analysis !== null,
    isLoading,
    updateFilter,
    resetFilters,
  };
}
