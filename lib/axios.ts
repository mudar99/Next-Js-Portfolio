// src/lib/axiosInstance.ts
import axios, { AxiosError, AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/api";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
  timeout: 10000,
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as typeof config.headers;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  // IMPORTANT: return the whole AxiosResponse here (not response.data)
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Centralized error logging/handling
    if (error.response) {
      const status = error.response.status;
      const msg =
        (error.response.data as ApiResponse<unknown>)?.message || error.message;
      switch (status) {
        case 400:
          console.warn("⚠️ Bad Request:", msg);
          break;
        case 401:
          console.warn("🔒 Unauthorized:", msg);
          break;
        case 403:
          console.warn("🚫 Forbidden:", msg);
          break;
        case 404:
          console.warn("❓ Not Found:", msg);
          break;
        case 500:
          console.error("💥 Server Error:", msg);
          break;
        default:
          console.error("❗ Unexpected Error:", msg);
      }
    } else if (error.request) {
      console.error("📡 No response from server — possible connection issue");
    } else {
      console.error("⚙️ Axios config error:", error.message);
    }
    return Promise.reject(error);
  }
);
