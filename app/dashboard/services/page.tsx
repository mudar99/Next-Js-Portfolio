"use client";

import React from "react";
import EditSummary from "./actions/EditSummary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Edit2, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import AddService from "./actions/AddService";
import EditService from "./actions/EditService";

interface Service {
  id: string;
  title: string;
  desc: string;
  color: string;
}

export default function ServicePage() {
  const queryClient = useQueryClient();

  const deleteService = useMutation({
    mutationFn: async (serviceId: string) => {
      return await axiosInstance.delete(`/services/${serviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("service deleted successfully");
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

  const editService = useMutation({
    mutationFn: async (service: Service) => {
      return await axiosInstance.put(`/services/${service.id}`, service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("service edited successfully");
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

  const editSummary = useMutation({
    mutationFn: async (servicesSummary: string) => {
      return await axiosInstance.put(`/services/summary`, { servicesSummary });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("service summary edited successfully");
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

  const addService = useMutation({
    mutationFn: async (e: { title: string; desc: string; color: string }) => {
      return await axiosInstance.post(`/service`, e);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("service added successfully");
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

  const { data, isLoading, error } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/services");
      console.log(data);
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading hero</div>;

  return (
    <div>
      <section className="my-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-3xl font-bold text-yellow-400 tracking-wide">
            My Services
          </h2>

          <EditSummary
            summary={data?.servicesSummary}
            trigger={
              <Button
                variant="ghost"
                className="cursor-pointer group rounded-full p-2 hover:bg-yellow-400/10 transition-all duration-300 mt-2"
              >
                <Edit2 className="h-5 w-5 text-gray-400 transition-all group-hover:text-yellow-400 group-hover:scale-125" />
              </Button>
            }
            onUpdate={(e) => editSummary.mutate(e)}
          />
        </div>

        <p className="text-md text-center text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {data?.servicesSummary}
        </p>
      </section>

      <section className="my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.services.map(
          (
            item: { id: string; title: string; color: string; desc: string },
            index: number
          ) => (
            <Card key={index} className="rounded-3xl border p-8">
              <div className="flex justify-between items-center">
                <h2
                  className="text-2xl font-bold mb-3 "
                  style={{ color: item.color }}
                >
                  {item.title}
                </h2>
                <div>
                  <EditService
                    service={item}
                    trigger={
                      <Button
                        variant="ghost"
                        className="cursor-pointer group rounded-full p-2 hover:bg-yellow-400/10 transition-all duration-300"
                      >
                        <Edit2 className="h-5 w-5 text-gray-400 transition-all group-hover:text-yellow-400 group-hover:scale-125" />
                      </Button>
                    }
                    onUpdate={(e) => editService.mutate(e)}
                  />
                  <ConfirmationDialog
                    type="delete"
                    trigger={
                      <Button
                        variant="ghost"
                        className="cursor-pointer group rounded-full p-2 hover:bg-yellow-400/10 transition-all duration-300"
                      >
                        <Trash className="h-5 w-5 text-gray-400 transition-all group-hover:text-red-400 group-hover:scale-125" />
                      </Button>
                    }
                    title="Delete this service?"
                    description="This cannot be undone."
                    onConfirm={() => deleteService.mutate(item.id)}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </Card>
          )
        )}

        <AddService
          onAdd={(e) => addService.mutate(e)}
          trigger={
            <Card className="group cursor-pointer rounded-3xl border p-8 hover:shadow-xl hover:border-yellow-400 transition-all duration-300 bg-card/40 backdrop-blur-sm">
              <div className="flex items-center gap-6">
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-yellow-400 text-lg group-hover:tracking-wide transition-all">
                    Create a new service
                  </span>

                  <span className="text-sm text-gray-400 mt-1">
                    Click here to add a new service
                  </span>
                </div>
                <Plus className="h-10 w-10 p-2 rounded-full border border-yellow-400 text-yellow-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-yellow-400 group-hover:text-black" />
              </div>
            </Card>
          }
        />
      </section>
    </div>
  );
}
