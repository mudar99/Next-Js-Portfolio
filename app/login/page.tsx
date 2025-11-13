"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import { toast } from "sonner";

const Login = () => {
  const navigate = useRouter();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await axiosInstance.post<ApiResponse<{ token: string }>>(
        "/auth/login",
        payload
      );
      console.log(res);
      // نتحقق من success
      if (!res.data.status) {
        throw new Error(res.data.message || "Login failed");
      }

      return res.data;
    },
    onSuccess: (response) => {
      console.log("Token:", response.data.token);
      localStorage.setItem("access_token", response.data.token);
      toast.success(response.message);
      navigate.push("/dashboard");
    },
    onError: (err: AxiosError<ApiResponse<unknown>>) => {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred";
      console.error("❌ Error sending:", msg);
      toast.error(msg);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username ?? "");
    formData.append("password", password ?? "");

    mutation.mutate(formData);
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl w-[380px] p-10 flex flex-col gap-6 text-white z-10"
      >
        <h2 className="text-3xl font-bold text-center mb-2 drop-shadow-md">
          Control Panel ✨
        </h2>

        <p className="text-sm font-semibold text-center mb-2">
          Log in to your control panel to update and manage your portfolio
          content.
        </p>

        <div className="grid gap-2">
          <Label htmlFor="username" className="text-sm text-gray-200">
            Username
          </Label>
          <Input
            id="username"
            required
            className="w-full px-3 py-2 rounded-md bg-white/10 border focus:outline-none focus:ring-2 focus:ring-pink-300 text-white placeholder:text-white border-ring"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-sm text-gray-200">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            required
            className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-300 text-white"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="mt-4 bg-white/20 hover:bg-white/30 transition-all py-2 rounded-md font-semibold backdrop-blur-md border border-white/30"
        >
          Login
        </Button>
      </form>

      {/* ضباب خلفي متحرك بلون ناعم */}
      <div className="absolute w-[300px] h-[300px] bg-white/20 rounded-full blur-3xl bottom-1/6 left-1/4 animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-pink-400/30 rounded-full blur-3xl top-1/6 right-1/4 animate-pulse"></div>
    </div>
  );
};

export default Login;
