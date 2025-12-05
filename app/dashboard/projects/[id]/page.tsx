"use client";

import Image from "next/image";
import EditProjectDialog from "./EditProject";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Edit2, Trash } from "lucide-react";
import { objectToFormData } from "@/app/utils/objectToForm";
import ConfirmationDialog from "../../components/ConfirmationDialog";

interface Project {
  id: string;
  title: string;
  projectName: string;
  description: string;
  requirements: string[];
  technologies: string[];
  gallery: File[];
  thumbnail: File | null;
  demoVideo: File | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProjectPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteProject = useMutation({
    mutationFn: async () => {
      return await axiosInstance.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
      router.push("/dashboard/projects"); 
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

  const editProject = useMutation({
    mutationFn: async (project: Project) => {
      const formdata = objectToFormData(project);
      console.log([...formdata.entries()]);
      return await axiosInstance.put(`/projects/${project.id}`, formdata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast.success("project edited successfully");
      router.push("/dashboard/projects");
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
    queryKey: ["project", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/projects/${id}`);
      console.log(data);
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading hero</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {data && (
        <EditProjectDialog
          trigger={
            <Button
              variant="ghost"
              className="cursor-pointer group rounded-full p-2 hover:bg-yellow-400/10 transition-all duration-300 mt-2"
            >
              <Edit2 className="h-5 w-5 text-gray-400 transition-all group-hover:text-yellow-400 group-hover:scale-125" />
            </Button>
          }
          project={data}
          onUpdate={(e) => editProject.mutate(e)}
        />
      )}
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
        onConfirm={() => deleteProject.mutate()}
      />
      <div className="flex flex-col md:flex-row items-center gap-6">
        {data.thumbnail && (
          <div className="w-full md:w-1/3 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={`${process.env.NEXT_PUBLIC_FILE_API}${data.thumbnail}`}
              alt={data.projectName}
              width={400}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{data.projectName}</h1>
          <p className="text-foreground text-lg">{data.title}</p>
        </div>
      </div>

      {/* Description */}
      <section className="bg-background p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Project Description</h2>
        <p className="text-foreground whitespace-pre-line">
          {data.description}
        </p>
      </section>

      {/* Requirements */}
      {data.requirements?.length > 0 && (
        <section className="bg-background p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Project Requirements</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground">
            {data.requirements.map((req: string, idx: number) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Technologies */}
      {data.technologies?.length > 0 && (
        <section className="bg-background p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {data.technologies.map((tech: string, idx: number) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {data.gallery?.length > 0 && (
        <section className="bg-background p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Project Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.gallery.map((img: string, idx: number) => (
              <div key={idx} className="rounded-xl overflow-hidden shadow-md">
                <Image
                  src={`${process.env.NEXT_PUBLIC_FILE_API}${img}`}
                  alt={`Gallery ${idx + 1}`}
                  width={400}
                  height={300}
                  className="object-cover w-full h-48"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Demo Video */}
      {data.demoVideo && (
        <section className="bg-background p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Demo Video</h2>
          <video
            src={`${process.env.NEXT_PUBLIC_FILE_API}${data.demoVideo}`}
            controls
            className="w-full rounded-xl shadow-lg"
          />
        </section>
      )}
    </div>
  );
}
