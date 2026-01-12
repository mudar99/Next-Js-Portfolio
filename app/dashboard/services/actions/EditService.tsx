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
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { ServiceItemType } from "@/app/schemas/services.schema";

interface EditServiceDialogProps {
  trigger: React.ReactNode;
  service: ServiceItemType;
  onUpdate: (service: ServiceItemType) => Promise<unknown> | void;
}

export default function EditService({
  trigger,
  service,
  onUpdate,
}: EditServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(service);

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
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="serviceTitle">Service title</Label>
            <Input
              required
              id="serviceTitle"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="serviceDescription">Service description</Label>
            <Textarea
              required
              id="serviceDescription"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cardColor">Card Color</Label>
            <Input
              required
              type="color"
              id="cardColor"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
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
