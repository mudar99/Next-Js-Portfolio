"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginType } from "../schemas/login.schema";
import { objectToFormData } from "../utils/objectToForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProviderWrapper,
} from "@/components/ui/form";

const Login = () => {
  const navigate = useRouter();

  const methods = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const res = await axiosInstance.post<ApiResponse<{ token: string }>>(
        "/auth/login",
        payload
      );
      console.log(res);
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

  const onSubmit = (data: LoginType) => {
    const formData = objectToFormData(data);
    mutation.mutate(formData);
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
      <FormProviderWrapper methods={methods}>
        <Form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl w-[380px] p-10 flex flex-col gap-6 text-white z-10"
        >
          <h2 className="text-3xl font-bold text-center mb-2 drop-shadow-md">
            Control Panel ✨
          </h2>

          <p className="text-sm font-semibold text-center mb-2">
            Log in to your control panel to update and manage your portfolio
            content.
          </p>

          <FormField
            name="username"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="username">Username</FormLabel>
                <FormControl>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    {...field}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    {...field}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </FormControl>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="mt-4 bg-white/20 hover:bg-white/30"
          >
            {mutation.isPending ? "Loading..." : "Login"}
          </Button>
        </Form>
      </FormProviderWrapper>

      <div className="absolute w-[300px] h-[300px] bg-white/20 rounded-full blur-3xl bottom-1/6 left-1/4 animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-pink-400/30 rounded-full blur-3xl top-1/6 right-1/4 animate-pulse"></div>
    </div>
  );
};

export default Login;
