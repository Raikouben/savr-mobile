import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useReport } from "../useReport";

export const useReportQuery = (reportId?: string) => {
  const { getReports, getReport } = useReport();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["report"],
    queryFn: getReports,
  });

  const reportQuery = useQuery({
    queryKey: ["report", reportId],

    queryFn: () => getReport(reportId!),
    enabled: !!reportId,
  });

  return {
    reports: query.data,
    report: reportQuery.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
