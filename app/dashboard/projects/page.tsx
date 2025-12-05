"use client";
import { Card } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import AddProject from "./actions/AddProject";

// type Project = {
//   id: number;
//   title: string;
//   projectName: string;
//   description: string;
//   demoVideo: string;
//   thumbnail: string;
//   gallery: string[];
//   technologies: string[];
//   requirements: string[];
//   createdAt?: string;
//   updatedAt?: string;
// };

type ProjectListItem = [
  {
    id: number;
    title: string;
    projectName: string;
    thumbnail: string | null;
  }
];

export default function ProjectPage() {
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: async (form: FormData) => {
      return axiosInstance.post("/project", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Project created!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<ProjectListItem>({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/projects");
      console.log(data);
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading projects</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects?.map(
        (item: {
          id: number;
          title: string;
          projectName: string;
          thumbnail: string | null;
        }) => (
          <Link key={item.id} href={`/dashboard/projects/${item.id}`}>
            <div className="group block transform transition duration-500 hover:scale-105">
              <div className="relative bg-white/5 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full">
                <div className="flex justify-center h-50 w-full">
                  {item.thumbnail ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_FILE_API}${item.thumbnail}`}
                      width={150}
                      height={150}
                      alt={item.projectName}
                      className="object-cover w-full h-full shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-50 w-full bg-gray-500 flex items-center justify-center text-lg font-medium">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-200 group-hover:text-yellow-400 transition-colors duration-300">
                      {item.projectName}
                    </h3>
                    <p className="text-gray-500 mt-2">{item.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )
      )}
      <AddProject
        trigger={
          <Card className="group cursor-pointer rounded-3xl border p-8 hover:shadow-xl hover:border-yellow-400 transition-all duration-300 bg-card/40 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-yellow-400 text-lg group-hover:tracking-wide transition-all">
                  Create a new project
                </span>

                <span className="text-sm text-gray-400 mt-1">
                  Click here to add a new project
                </span>
              </div>
              <Plus className="h-10 w-10 p-2 rounded-full border border-yellow-400 text-yellow-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-yellow-400 group-hover:text-black" />
            </div>
          </Card>
        }
        onAdd={(formData) => createProjectMutation.mutate(formData)}
      />
    </div>
  );
}
