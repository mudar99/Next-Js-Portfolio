"use client";

import Image from "next/image";
import React from "react";
import { IoLocationSharp, IoMail } from "react-icons/io5";
import { FaGraduationCap, FaMedal } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaBirthdayCake } from "react-icons/fa";
import EditAboutDialog from "./EditAboutDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { aboutSchema, AboutType } from "@/app/schemas/about.schema";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import { objectToFormData } from "@/app/utils/objectToForm";
import { validateOrThrow } from "@/app/utils/validateOrThrow";

export default function AboutPage() {
  const queryClient = useQueryClient();

  function InfoItem({
    icon: Icon,
    color,
    title,
    value,
  }: {
    icon: React.ElementType;
    color: string;
    title: string;
    value: string | undefined;
  }) {
    return (
      <div className="flex items-center gap-3 ">
        <div
          className="flex items-center justify-center rounded-full h-9 w-9 shrink-0 "
          style={{ backgroundColor: color }}
        >
          <Icon className="text-white h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">{title}</h2>
          <p className="text-sm text-gray-300 wrap-break-word">{value}</p>
        </div>
      </div>
    );
  }

  const editAbout = useMutation({
    mutationFn: async (about: AboutType) => {
      const validData = validateOrThrow(aboutSchema, about);

      const form = objectToFormData(validData);
      return axiosInstance.put(`/about`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("about edited successfully");
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

  const { data, isLoading, error } = useQuery<AboutType>({
    queryKey: ["about"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/about");
      const parsed = aboutSchema.safeParse(data.data);
      if (!parsed.success) {
        console.error("❌ API returned invalid about object", parsed.error);
        throw new Error("Invalid about data received from server");
      }

      return parsed.data;
    },
    refetchOnWindowFocus: false,
  });

  const infoData = [
    {
      icon: IoLocationSharp,
      color: "#ec4899",
      title: "Address:",
      value: data?.address,
    },
    {
      icon: IoMail,
      color: "#f87171",
      title: "Email:",
      value: data?.hero.emailLink,
    },
    {
      icon: IoLogoWhatsapp,
      color: "#22c55e",
      title: "Whatsapp:",
      value: data?.phone,
    },
    {
      icon: FaBirthdayCake,
      color: "#a855f7",
      title: "Date of birth:",
      value: data?.birthdate.toLocaleDateString("en-GB"),
    },
    {
      icon: FaMedal,
      color: "#eab308",
      title: "Honors:",
      value: data?.honors,
    },
    {
      icon: FaGraduationCap,
      color: "#1f2937",
      title: "Study:",
      value: data?.study,
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <section className="relative overflow-hidden py-24 px-6 border text-white rounded-3xl shadow-xl bg-card">
        {/* {data && <EditAboutDialog data={data} />} */}
        {data && (
          <EditAboutDialog
            data={data}
            trigger={
              <Button
                variant="ghost"
                className="cursor-pointer group rounded-full p-2 hover:bg-yellow-400/10 transition-all duration-300"
              >
                <Edit2 className="h-5 w-5 text-gray-400 transition-all group-hover:text-yellow-400 group-hover:scale-125" />
              </Button>
            }
            onUpdate={(e) => editAbout.mutateAsync(e)}
          />
        )}
        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="relative shrink-0">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl hover:scale-105 transition-transform duration-500">
              <Image
                src={`${process.env.NEXT_PUBLIC_FILE_API}${data?.image}`}
                alt="Mudar Abo Fakher"
                width={256}
                height={256}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-bold text-yellow-400 drop-shadow-lg">
              {data?.hero.name}
            </h2>
            <p className="text-lg text-gray-200 leading-relaxed">{data?.bio}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {infoData.map((item, index) => (
                <InfoItem key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
