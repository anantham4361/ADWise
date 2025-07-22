import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analysisApi } from '../services/api';

export const useAnalysisReports = () => {
  const queryClient = useQueryClient();

  const {
    data: reports = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['analysis-reports'],
    queryFn: analysisApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const deleteReportMutation = useMutation({
    mutationFn: analysisApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysis-reports'] });
    },
  });

  return {
    reports,
    isLoading,
    error,
    refetch,
    deleteReport: deleteReportMutation.mutateAsync,
    isDeleting: deleteReportMutation.isPending,
  };
};