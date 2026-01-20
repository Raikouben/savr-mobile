import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useReport } from "../useReport";

export const useReportQuery = () => {
    const { getReport } = useReport();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["report"],
        queryFn: getReport,
    });

    return {
        report: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
};