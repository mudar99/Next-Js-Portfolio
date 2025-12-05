"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import EditCertificate from "./actions/EditCertificate";
import { Button } from "@/components/ui/button";
import { Edit2, Link2, Plus, Trash } from "lucide-react";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import { objectToFormData } from "@/app/utils/objectToForm";
import AddCertificate from "./actions/AddCertificate";
import { Card } from "@/components/ui/card";

interface Certificate {
  id: string;
  title: string;
  image: File | string | null;
  link: string;
}

export default function ProjectPage() {
  const queryClient = useQueryClient();

  const addCertificate = useMutation({
    mutationFn: async (certificate: Certificate) => {
      return await axiosInstance.post(
        `/certificates`,
        objectToFormData(certificate)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast.success("Certificate added successfully");
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

  const deleteCertificate = useMutation({
    mutationFn: async (certificateId: string) => {
      return await axiosInstance.delete(`/certificates/${certificateId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast.success("certificate deleted successfully");
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

  const editCertificate = useMutation({
    mutationFn: async (certificate: Certificate) => {
      return await axiosInstance.put(
        `/certificates/${certificate.id}`,
        objectToFormData(certificate)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast.success("certificate edited successfully");
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
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/certificates");
      console.log(data);
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading hero</div>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {data.map(
        (item: {
          id: string;
          title: string;
          link: string;
          image: string | null;
        }) => (
          <div key={item.id}>
            <div className="group block transform transition duration-500 hover:scale-105">
              <div className="relative bg-white/5 rounded-3xl shadow-xl">
                <div className="flex justify-center ">
                  {item.image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_FILE_API}${item.image}`}
                      width={150}
                      height={150}
                      alt={item.title}
                      className="rounded-t-3xl object-cover w-full h-full shadow-lg"
                    />
                  ) : (
                    <div className="w-36 h-36 bg-gray-200 rounded-full flex items-center justify-center text-lg font-medium">
                      No Image
                    </div>
                  )}
                  <div className="flex flex-col gap-2 absolute -right-4 top-1/2 -translate-y-1/2">
                    <EditCertificate
                      certificate={item}
                      trigger={
                        <Button
                          variant="default"
                          className="w-8 h-8 cursor-pointer rounded-full p-2 transition-all duration-300 bg-yellow-400 text-white hover:bg-yellow-500"
                        >
                          <Edit2 />
                        </Button>
                      }
                      onUpdate={(e) => editCertificate.mutate(e)}
                    />
                    <ConfirmationDialog
                      type="delete"
                      trigger={
                        <Button
                          variant="default"
                          className="w-8 h-8 cursor-pointer rounded-full p-2 transition-all duration-300 bg-red-400 text-white hover:bg-red-500"
                        >
                          <Trash />
                        </Button>
                      }
                      title="Delete this certificate?"
                      description="This cannot be undone."
                      onConfirm={() => deleteCertificate.mutate(item.id)}
                    />
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      key={item.id}
                      href={`${item.link}`}
                    >
                      <Button
                        variant="default"
                        className="w-8 h-8 cursor-pointer rounded-full p-2 transition-all duration-300 bg-blue-400 text-white hover:bg-blue-500"
                      >
                        <Link2 />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-200 group-hover:text-yellow-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 mt-2">{item.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
      <AddCertificate
        onAdd={(e) => addCertificate.mutate(e)}
        trigger={
          <Card className="group cursor-pointer rounded-3xl border p-8 hover:shadow-xl hover:border-yellow-400 transition-all duration-300 bg-card/40 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-yellow-400 text-lg group-hover:tracking-wide transition-all">
                  Create a new Certificate
                </span>

                <span className="text-sm text-gray-400 mt-1">
                  Click here to add a new Certificate
                </span>
              </div>
              <Plus className="h-10 w-10 p-2 rounded-full border border-yellow-400 text-yellow-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-yellow-400 group-hover:text-black" />
            </div>
          </Card>
        }
      />
    </div>
  );
}
