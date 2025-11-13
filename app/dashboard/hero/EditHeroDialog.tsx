"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

/* -------------------- Types -------------------- */
type Phrase = string;

interface Stat {
  value: string;
  title: string;
}

interface Profession {
  title: string;
  image: File | string | null;
}

export interface HeroData {
  id: number;
  name: string;
  profession: string;
  emailLink: string;
  skillsSummary: string;
  image: File | string | null;
  cvFile: File | string | null;
  phrases: Phrase[];
  stats: Stat[];
  professions: Profession[];
  createdAt?: string;
  updatedAt?: string;
}

type Props = {
  data: HeroData;
};

/* -------------------- Component -------------------- */
export default function EditHeroDialog({ data }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<HeroData>({
    ...data,
    // normalize undefined -> null for file fields
    image: data.image ?? null,
    cvFile: data.cvFile ?? null,
    phrases: data.phrases ?? [],
    stats: data.stats ?? [],
    professions: data.professions?.map((p) => ({ ...p })) ?? [],
  });

  /* -------- simple field handlers -------- */
  const setField = (
    key: keyof Omit<HeroData, "phrases" | "stats" | "professions">,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value } as HeroData));
  };

  const handleFileField = (
    key: "image" | "cvFile",
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;
    setField(key, file);
  };

  /* -------- phrases handlers (string[]) -------- */
  const addPhrase = () =>
    setFormData((p) => ({ ...p, phrases: [...p.phrases, ""] }));
  const removePhrase = (index: number) =>
    setFormData((p) => ({
      ...p,
      phrases: p.phrases.filter((_, i) => i !== index),
    }));
  const updatePhrase = (index: number, value: string) =>
    setFormData((p) => {
      const copy = [...p.phrases];
      copy[index] = value;
      return { ...p, phrases: copy };
    });

  /* -------- stats handlers (Stat[]) -------- */
  const addStat = () =>
    setFormData((p) => ({
      ...p,
      stats: [...p.stats, { value: "", title: "" }],
    }));
  const removeStat = (index: number) =>
    setFormData((p) => ({
      ...p,
      stats: p.stats.filter((_, i) => i !== index),
    }));
  const updateStat = (index: number, field: keyof Stat, value: string) =>
    setFormData((p) => {
      const copy = p.stats.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      );
      return { ...p, stats: copy };
    });

  /* -------- professions handlers (Profession[]) -------- */
  const addProfession = () =>
    setFormData((p) => ({
      ...p,
      professions: [...p.professions, { title: "", image: null }],
    }));
  const removeProfession = (index: number) =>
    setFormData((p) => ({
      ...p,
      professions: p.professions.filter((_, i) => i !== index),
    }));
  const updateProfessionTitle = (index: number, title: string) =>
    setFormData((p) => {
      const copy = p.professions.map((item, i) =>
        i === index ? { ...item, title } : item
      );
      return { ...p, professions: copy };
    });
  const updateProfessionImage = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((p) => {
      const copy = p.professions.map((item, i) =>
        i === index ? { ...item, image: file } : item
      );
      return { ...p, professions: copy };
    });
  };

  /* -------- submit (placeholder) -------- */
  const mutation = useMutation({
    mutationFn: async (body: FormData) => {
      const res = await axiosInstance.put("/hero", body);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero"] });
      console.log("✅ Hero updated successfully");
    },
    onError: (err) => console.error("❌ Error sending", err),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = new FormData();
    body.append("name", formData.name);
    body.append("profession", formData.profession);
    body.append("skillsSummary", formData.skillsSummary);
    body.append("emailLink", formData.emailLink);

    if (formData.image) body.append("image", formData.image);
    if (formData.cvFile) body.append("cvFile", formData.cvFile);

    for (let i = 0; i < formData.stats.length; i++) {
      body.append(`stats[${i}][title]`, formData.stats[i].title);
      body.append(`stats[${i}][value]`, formData.stats[i].value);
    }
    for (let i = 0; i < formData.professions.length; i++) {
      body.append(`professions[${i}][title]`, formData.professions[i].title);
      body.append(`professions[${i}][image]`, formData.professions[i].image!);
    }
    for (let i = 0; i < formData.phrases.length; i++) {
      body.append(`phrases[${i}]`, formData.phrases[i]);
    }

    mutation.mutate(body);
    setOpen(false);
  };

  /* -------- UI -------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Hero Section</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <form onSubmit={handleSubmit} className="grid gap-6 p-2">
          <DialogHeader>
            <DialogTitle>Edit Hero Section</DialogTitle>
            <DialogDescription>
              Update phrases, stats, professions and files.
            </DialogDescription>
          </DialogHeader>

          {/* Basic fields */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              required
              id="name"
              value={formData.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              required
              id="profession"
              value={formData.profession}
              onChange={(e) => setField("profession", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="skillsSummary">Skills Summary</Label>
            <Input
              required
              id="skillsSummary"
              value={formData.skillsSummary}
              onChange={(e) => setField("skillsSummary", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="emailLink">Email</Label>
            <Input
              required
              id="emailLink"
              value={formData.emailLink}
              onChange={(e) => setField("emailLink", e.target.value)}
            />
          </div>

          {/* File fields */}
          <div className="grid gap-2">
            <Label htmlFor="image">Profile Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileField("image", e)}
            />
            {/* preview if URL or File */}
            {formData.image && (
              <div className="mt-2">
                {typeof formData.image === "string" ? (
                  // existing image URL
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={process.env.NEXT_PUBLIC_FILE_API + formData.image}
                    alt="preview"
                    className="w-32 h-32 object-contain rounded-md"
                  />
                ) : (
                  <div className="text-sm">New file: {formData.image.name}</div>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cvFile">CV (PDF)</Label>
            <Input
              id="cvFile"
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileField("cvFile", e)}
            />
            {formData.cvFile && (
              <div className="mt-2 text-sm">
                {typeof formData.cvFile === "string" ? (
                  <a href={formData.cvFile} target="_blank" rel="noreferrer">
                    Existing CV
                  </a>
                ) : (
                  <span>New file: {formData.cvFile.name}</span>
                )}
              </div>
            )}
          </div>

          {/* Phrases */}
          <fieldset className="space-y-2">
            <Label>Phrases</Label>
            {formData.phrases.map((ph, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  required
                  value={ph}
                  onChange={(e) => updatePhrase(idx, e.target.value)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removePhrase(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="text-center">
              <Button variant="outline" size="icon" onClick={addPhrase}>
                <Plus />
              </Button>
            </div>
          </fieldset>

          {/* Stats */}
          <fieldset className="space-y-2">
            <Label>Statistics</Label>
            {formData.stats.map((s, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-2">
                <Input
                  required
                  placeholder="Title"
                  value={s.title}
                  onChange={(e) => updateStat(idx, "title", e.target.value)}
                />
                <Input
                  required
                  placeholder="Value"
                  value={s.value}
                  onChange={(e) => updateStat(idx, "value", e.target.value)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="col-span-2"
                  onClick={() => removeStat(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="text-center">
              <Button variant="outline" size="icon" onClick={addStat}>
                <Plus />
              </Button>
            </div>
          </fieldset>

          {/* Professions */}
          <fieldset className="space-y-2">
            <Label>Professions</Label>
            {formData.professions.map((p, idx) => (
              <div key={idx} className="flex gap-2 items-center rounded-md">
                <Input
                  required
                  value={p.title}
                  placeholder="Title"
                  onChange={(e) => updateProfessionTitle(idx, e.target.value)}
                />
                <Input
                  required={p.image ? false : true}
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateProfessionImage(idx, e)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="col-span-2"
                  onClick={() => removeProfession(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="text-center">
              <Button variant="outline" size="icon" onClick={addProfession}>
                <Plus className="" />
              </Button>
            </div>
          </fieldset>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
