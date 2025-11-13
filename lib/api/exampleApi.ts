// src/lib/api/exampleApi.ts
import { axiosInstance } from "../axios";

export const exampleApi = {
  getUsers: async () => {
    const { data } = await axiosInstance.get("/users");
    return data;
  },

  getUserById: async (id: string) => {
    const { data } = await axiosInstance.get(`/users/${id}`);
    return data;
  },
};
