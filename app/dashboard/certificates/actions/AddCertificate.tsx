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
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddCertificateDialogProps {
  trigger: React.ReactNode;
  onAdd: (certificate: {
    id: string;
    title: string;
    image: File | string | null;
    link: string;
  }) => Promise<unknown> | void;
}

export default function AddCertificate({
  trigger,
  onAdd,
}: AddCertificateDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: "",
    title: "",
    image: "",
    link: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // needed to avoid page reload

    setLoading(true);
    await onAdd(form);
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="rounded-2xl bg-card border border-white/10">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Certificate</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="certificateTitle">Certificate title</Label>
              <Input
                required
                id="certificateTitle"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="certificateLink">Certificate link</Label>
              <Input
                type="url"
                required
                id="certificateLink"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="certificateImage">Certificate image</Label>
              <Input
                type="file"
                accept="image/*"
                required
                onChange={(e) =>
                  setForm({ ...form, image: e.target.files?.[0] || null })
                }
                id="certificateImage"
              />
              {form.image && (
                <div className="mt-2 flex justify-center">
                  {typeof form.image === "string" ? (
                    // existing image URL
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={process.env.NEXT_PUBLIC_FILE_API + form.image}
                      alt="preview"
                      className="w-32 h-32 object-contain rounded-md"
                    />
                  ) : (
                    <div className="text-sm">New file: {form.image.name}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Certificate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
