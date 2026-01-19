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
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  servicesSummarySchema,
  ServicesSummaryType,
} from "@/app/schemas/services.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProviderWrapper,
} from "@/components/ui/form";

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

  const methods = useForm<ServicesSummaryType>({
    resolver: zodResolver(servicesSummarySchema),
    defaultValues: {
      servicesSummary,
    },
  });

  useEffect(() => {
    if (open) {
      methods.reset({ servicesSummary });
    }
  }, [open, servicesSummary, methods]);

  const onSubmit = async (data: ServicesSummaryType) => {
    setLoading(true);
    await onUpdate(data.servicesSummary);
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="rounded-2xl bg-card border border-white/10">
        <FormProviderWrapper methods={methods}>
          <Form onSubmit={methods.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Summary</DialogTitle>
            </DialogHeader>

            <div className="grid gap-2 mt-4">
              <FormLabel htmlFor="servicesSummary">
                Service description
              </FormLabel>

              <FormField
                name="servicesSummary"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="servicesSummary"
                        placeholder="Write services summary..."
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Save"}
              </Button>
            </DialogFooter>
          </Form>
        </FormProviderWrapper>
      </DialogContent>
    </Dialog>
  );
}
