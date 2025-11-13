// src/lib/queryFactory.ts
import {
  useMutation,
  useQuery,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

// ✅ Generic Query Hook
export function useApiQuery<TData = unknown>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">
) {
  return useQuery<TData>({
    queryKey: key,
    queryFn: async (): Promise<TData> => {
      const { data } = await axiosInstance.get<TData>(url);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

// ✅ Generic Mutation Hook
export function useApiMutation<
  TData = unknown,
  TVariables = Record<string, unknown>
>(
  url: string,
  method: "post" | "put" | "delete",
  options?: UseMutationOptions<TData, unknown, TVariables>
) {
  return useMutation<TData, unknown, TVariables>({
    mutationFn: async (payload: TVariables): Promise<TData> => {
      const res = await axiosInstance[method]<TData>(url, payload);
      return res.data;
    },
    ...options,
  });
}
