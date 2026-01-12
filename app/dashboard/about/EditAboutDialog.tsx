// components/dialogs/EditAboutDialog.tsx
"use client";

import { FormEvent, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  // DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { axiosInstance } from "@/lib/axios";
// import { aboutSchema, AboutType } from "@/app/schemas/about.schema";
// import { objectToFormData } from "@/app/utils/objectToForm";
// import { toast } from "sonner";
import Image from "next/image";
import { AboutType } from "@/app/schemas/about.schema";

// type Props = {
//   data: AboutType;
// };

interface EditAboutDialogProps {
  trigger: React.ReactNode;
  data: AboutType;
  onUpdate: (data: AboutType) => Promise<unknown> | void;
}

export default function EditAboutDialog({
  trigger,
  data,
  onUpdate,
}: EditAboutDialogProps) {
  // export default function EditAboutDialog({ data }: Props) {
  const [formData, setFormData] = useState<AboutType>(data);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const queryClient = useQueryClient();

  function handleChange(key: string, value: string | File | null | Date) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }
  // const mutation = useMutation({
  //   mutationFn: async (body: FormData) => {
  //     const res = await axiosInstance.put("/about", body);
  //     return res.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["about"] });
  //     toast.success("About updated successfully");
  //   },
  //   onError: (err) => console.error("❌ Error sending", err),
  // });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(formData);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const parsed = aboutSchema.safeParse(formData);
  //   // console.log(parsed);
  //   const form = objectToFormData(parsed.data);
  //   for (const value of form.values()) {
  //     console.log(value);
  //   }

  //   if (parsed.error) {
  //     toast.error(
  //       <ul className="list-disc pl-5">
  //         {parsed.error.issues.map((err, idx) => (
  //           <li key={idx}>
  //             <strong>{err.path.join(".").toUpperCase()}:</strong> {err.message}
  //           </li>
  //         ))}
  //       </ul>
  //     );
  //     setOpen(false);
  //     return;
  //   }

  //   mutation.mutate(form);
  //   setOpen(false);
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <form onSubmit={handleSubmit} className="grid gap-6 p-2">
          <DialogHeader>
            <DialogTitle>Edit About Info</DialogTitle>
            <DialogDescription>Update about me information.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              required
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Whatsapp</Label>
            <Input
              required
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              required
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="birthdate">Birthdate</Label>
            <Input
              required
              type="date"
              id="birthdate"
              value={
                formData.birthdate
                  ? formData.birthdate.toISOString().slice(0, 10)
                  : ""
              }
              onChange={(e) =>
                handleChange("birthdate", new Date(e.target.value))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="birthdate">Honors</Label>
            <Input
              required
              id="honors"
              value={formData.honors}
              onChange={(e) => handleChange("honors", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="birthdate">Study</Label>
            <Input
              required
              id="study"
              value={formData.study}
              onChange={(e) => handleChange("study", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Profile Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleChange("image", e.target.files?.[0] ?? null)
              }
            />

            {formData.image && (
              <div className="mt-2">
                {typeof formData.image === "string" ? (
                  <Image
                    width={300}
                    height={300}
                    src={process.env.NEXT_PUBLIC_FILE_API + formData.image}
                    alt="preview"
                    className="w-32 h-32 object-contain rounded-md"
                  />
                ) : (
                  <Image
                    width={300}
                    height={300}
                    src={URL.createObjectURL(formData.image)}
                    alt="New file preview"
                    className="w-32 h-32 object-contain rounded-md"
                  />
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
