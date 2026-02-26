import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useReport } from "../useReport";
import { useAuth } from "@clerk/clerk-expo";

export const useReportQuery = (reportId?: number) => {
  const { getReports, getReport, markReportAsViewed } = useReport();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["report"],
    queryFn: getReports,
    enabled: !!isSignedIn,
  });

  const reportQuery = useQuery({
    queryKey: ["report", reportId],

    queryFn: () => getReport(reportId!),
    enabled: !!reportId,
  });

  const markReportAsViewedMutation = useMutation({
    mutationFn: (id: number) => markReportAsViewed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report"] });
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
    },
  });

  return {
    reports: query.data,
    report: reportQuery.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    markReportAsViewed: markReportAsViewedMutation.mutateAsync,
  };
};
