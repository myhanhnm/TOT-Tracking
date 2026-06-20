import { useActivityContext } from '../context';

type UseActivityAnalysisReturn = {
  analysis: ReturnType<typeof useActivityContext>['filteredAnalysis'];
  fileName: string | null;
  isLoading: boolean;
  error: string | null;
  hasData: boolean;
};

export function useActivityAnalysis(): UseActivityAnalysisReturn {
  const { filteredAnalysis, fileName, isLoading, error, analysis } = useActivityContext();

  return {
    analysis: filteredAnalysis,
    fileName,
    isLoading,
    error,
    hasData: analysis !== null,
  };
}
