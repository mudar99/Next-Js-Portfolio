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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface EditSummaryDialogProps {
  trigger: React.ReactNode;
  servicesSummary: string;
  onUpdate: (text: string) => Promise<unknown> | void;
}

export default function EditSummary({
  trigger,
  servicesSummary,
  onUpdate,
}: EditSummaryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState(servicesSummary);

  const handleSubmit = async () => {
    setLoading(true);
    await onUpdate(text);
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="rounded-2xl bg-card border border-white/10">
        <DialogHeader>
          <DialogTitle>Edit Summary</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="serviceDescription">Service description</Label>
          <Textarea
            required
            id="serviceDescription"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
