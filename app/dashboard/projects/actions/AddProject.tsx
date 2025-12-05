"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";

interface AddProjectDialogProps {
  trigger: React.ReactNode;
  onAdd: (form: FormData) => Promise<unknown> | void;
}

export default function AddProject({ trigger, onAdd }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [project, setProject] = useState({
    projectName: "",
    title: "",
    description: "",
    requirements: [""],
    technologies: [""],
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [demoVideo, setDemoVideo] = useState<File | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

  // Add or remove dynamic fields
  const addField = (key: "requirements" | "technologies") => {
    setProject({
      ...project,
      [key]: [...project[key], ""],
    });
  };

  const handleChangeArray = (
    index: number,
    value: string,
    key: "requirements" | "technologies"
  ) => {
    const updated = [...project[key]];
    updated[index] = value;
    setProject({ ...project, [key]: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("projectName", project.projectName);
    form.append("title", project.title);
    form.append("description", project.description);

    project.requirements.forEach((req) => form.append("requirements[]", req));
    project.technologies.forEach((tech) => form.append("technologies[]", tech));

    if (thumbnail) form.append("thumbnail", thumbnail);
    if (demoVideo) form.append("demoVideo", demoVideo);

    gallery.forEach((file) => form.append("gallery[]", file));

    await onAdd(form);

    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="rounded-2xl bg-card border border-white/10 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Project Name */}
            <div className="grid gap-2">
              <Label>Project Name</Label>
              <Input
                required
                value={project.projectName}
                onChange={(e) =>
                  setProject({ ...project, projectName: e.target.value })
                }
              />
            </div>

            {/* Title */}
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                required
                value={project.title}
                onChange={(e) =>
                  setProject({ ...project, title: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                required
                value={project.description}
                onChange={(e) =>
                  setProject({ ...project, description: e.target.value })
                }
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label>Requirements</Label>

              {project.requirements.map((item, index) => (
                <Input
                  key={index}
                  value={item}
                  onChange={(e) =>
                    handleChangeArray(index, e.target.value, "requirements")
                  }
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => addField("requirements")}
              >
                + Add Requirement
              </Button>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label>Technologies</Label>

              {project.technologies.map((item, index) => (
                <Input
                  key={index}
                  value={item}
                  onChange={(e) =>
                    handleChangeArray(index, e.target.value, "technologies")
                  }
                />
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => addField("technologies")}
              >
                + Add Technology
              </Button>
            </div>

            {/* Thumbnail */}
            <div className="grid gap-2">
              <Label>Thumbnail</Label>
              <Input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              />
            </div>

            {/* Demo Video */}
            <div className="grid gap-2">
              <Label>Demo Video</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => setDemoVideo(e.target.files?.[0] || null)}
              />
            </div>

            {/* Gallery */}
            <div className="grid gap-2">
              <Label>Gallery Images</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setGallery(files);
                  const previews = files.map((file) =>
                    URL.createObjectURL(file)
                  );
                  setGalleryPreview(previews);
                }}
              />
              <div>
                <div className="flex flex-wrap justify-center gap-3 p-3 rounded-lg">
                  {galleryPreview.map((url, index) => (
                    <Image
                      alt={`gallery-${index}`}
                      key={index}
                      width={200}
                      height={200}
                      src={url}
                      className="rounded-lg h-23 w-23 object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
