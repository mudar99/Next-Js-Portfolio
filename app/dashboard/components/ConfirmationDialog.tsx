"use client";

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
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, Info } from "lucide-react";
import { useState } from "react";

type DialogType = "delete" | "warning" | "success" | "custom";

interface ConfirmationDialogProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<unknown> | void; // Action from parent
}

export default function ConfirmationDialog({
  trigger,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  type = "warning",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}: ConfirmationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // dynamic styles
  const typeStyles = {
    delete: {
      icon: <Trash2 className="text-red-500 h-5 w-5" />,
      btn: "bg-red-500 hover:bg-red-600 text-white",
    },
    warning: {
      icon: <AlertTriangle className="text-yellow-400 h-5 w-5" />,
      btn: "bg-yellow-400 hover:bg-yellow-500 text-black",
    },
    success: {
      icon: <Info className="text-green-500 h-5 w-5" />,
      btn: "bg-green-500 hover:bg-green-600 text-white",
    },
    custom: {
      icon: <Info className="text-blue-500 h-5 w-5" />,
      btn: "bg-blue-500 hover:bg-blue-600 text-white",
    },
  };

  const { icon, btn } = typeStyles[type];

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false); // 🔥 Auto-close after success
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="rounded-2xl border border-white/10 bg-card shadow-xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            {icon}
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-3 pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="border-gray-600">
              {cancelText}
            </Button>
          </DialogClose>

          <Button
            onClick={handleConfirm}
            className={`${btn} min-w-[100px]`}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
