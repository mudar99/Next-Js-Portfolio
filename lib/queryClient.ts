// src/lib/queryClient.ts
// 🎯 هو المسؤول عن إدارة كل الكاشات — مثل Database صغير بالمتصفح
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 دقائق
    },
  },
});
