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
import Image from "next/image";
import { ChangeEvent, useState } from "react";

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

interface EditProjectDialogProps {
  trigger: React.ReactNode;
  project: Project;
  onUpdate: (project: Project) => Promise<unknown> | void;
}

export default function EditProjectDialog({
  trigger,
  project,
  onUpdate,
}: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /** TEXT FIELDS */
  const [form, setForm] = useState({
    id: project.id,
    projectName: project.projectName,
    title: project.title,
    description: project.description,
  });

  /** ARRAYS */
  const [requirements, setRequirements] = useState(project.requirements || []);
  const [technologies, setTechnologies] = useState(project.technologies || []);

  /** THUMBNAIL */
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    project.thumbnail
      ? `${process.env.NEXT_PUBLIC_FILE_API}${project.thumbnail}`
      : ""
  );

  /** GALLERY */
  const [gallery, setGallery] = useState<File[]>([]);
  const [galleryPreview, setGalleryPreview] = useState(
    (project.gallery || []).map(
      (img) => `${process.env.NEXT_PUBLIC_FILE_API}${img}`
    )
  );

  /** VIDEO */
  const [demoVideo, setDemoVideo] = useState<File | null>(null);
  const [demoVideoPreview, setDemoVideoPreview] = useState(
    project.demoVideo
      ? `${process.env.NEXT_PUBLIC_FILE_API}${project.demoVideo}`
      : ""
  );

  /** HANDLERS */

  const addRequirement = () => setRequirements([...requirements, ""]);
  const updateRequirement = (index: number, value: string) => {
    const arr = [...requirements];
    arr[index] = value;
    setRequirements(arr);
  };
  const removeRequirement = (index: number) =>
    setRequirements(requirements.filter((_, i) => i !== index));

  const addTechnology = () => setTechnologies([...technologies, ""]);
  const updateTechnology = (index: number, value: string) => {
    const arr = [...technologies];
    arr[index] = value;
    setTechnologies(arr);
  };
  const removeTechnology = (index: number) =>
    setTechnologies(technologies.filter((_, i) => i !== index));

  const handleThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleGallery = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGallery(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setGalleryPreview(previews);
  };

  const handleVideo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDemoVideo(file);
    setDemoVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      ...form,
      requirements,
      technologies,
      thumbnail,
      gallery,
      demoVideo,
    };
    await onUpdate(payload);
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-white/10 p-6">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* BASIC FIELDS */}
          <div className="grid gap-2">
            <Label>Project Name</Label>
            <Input
              value={form.projectName}
              onChange={(e) =>
                setForm({ ...form, projectName: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* THUMBNAIL */}
          <div className="grid gap-2">
            <Label>Thumbnail</Label>
            <Input type="file" accept="image/*" onChange={handleThumbnail} />

            {thumbnailPreview && (
              <Image
                src={thumbnailPreview}
                width={200}
                height={200}
                className="rounded-xl border"
                alt="Thumbnail"
              />
            )}
          </div>

          {/* REQUIREMENTS */}
          <div>
            <Label>Requirements</Label>
            <div className="space-y-2 mt-2">
              {requirements.map((req, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={req}
                    onChange={(e) => updateRequirement(i, e.target.value)}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => removeRequirement(i)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addRequirement}>
                Add Requirement
              </Button>
            </div>
          </div>

          {/* TECHNOLOGIES */}
          <div>
            <Label>Technologies</Label>
            <div className="space-y-2 mt-2">
              {technologies.map((tech, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={tech}
                    onChange={(e) => updateTechnology(i, e.target.value)}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => removeTechnology(i)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addTechnology}>
                Add Technology
              </Button>
            </div>
          </div>

          {/* GALLERY */}
          <div className="grid gap-2">
            <Label>Gallery Images</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGallery}
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
              {galleryPreview.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  width={200}
                  height={200}
                  className="rounded-xl border object-cover"
                  alt={`Gallery-${i}`}
                />
              ))}
            </div>
          </div>

          {/* VIDEO */}
          <div className="grid gap-2">
            <Label>Demo Video</Label>
            <Input type="file" accept="video/*" onChange={handleVideo} />

            {demoVideoPreview && (
              <video
                src={demoVideoPreview}
                controls
                className="rounded-xl border w-full max-w-[300px] mt-3"
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
