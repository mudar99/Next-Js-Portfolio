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
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface EditCertificateDialogProps {
  trigger: React.ReactNode;
  certificate: {
    id: string;
    title: string;
    image: File | string | null;
    link: string;
  };
  onUpdate: (certificate: {
    id: string;
    title: string;
    image: File | string | null;
    link: string;
  }) => Promise<unknown> | void;
}

export default function EditCertificate({
  trigger,
  certificate,
  onUpdate,
}: EditCertificateDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(certificate);

  const handleSubmit = async () => {
    setLoading(true);
    await onUpdate(form);
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="rounded-2xl bg-card border border-white/10">
        <DialogHeader>
          <DialogTitle>Edit Certificate</DialogTitle>
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
