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

interface AddServiceDialogProps {
  trigger: React.ReactNode;
  onAdd: (service: {
    title: string;
    desc: string;
    color: string;
  }) => Promise<unknown> | void;
}

export default function AddService({ trigger, onAdd }: AddServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [service, setService] = useState({
    title: "",
    desc: "",
    color: "#FFD700",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // needed to avoid page reload

    setLoading(true);
    await onAdd(service);
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="rounded-2xl bg-card border border-white/10">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="serviceTitle">Service title</Label>
              <Input
                required
                id="serviceTitle"
                value={service.title}
                onChange={(e) =>
                  setService({ ...service, title: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                required
                id="description"
                value={service.desc}
                onChange={(e) =>
                  setService({ ...service, desc: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cardColor">Card Color</Label>
              <Input
                type="color"
                required
                id="cardColor"
                value={service.color}
                onChange={(e) =>
                  setService({ ...service, color: e.target.value })
                }
              />
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
              {loading ? "Adding..." : "Add Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
