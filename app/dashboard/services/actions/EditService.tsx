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
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  serviceItemSchema,
  ServiceItemType,
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

  const methods = useForm<ServiceItemType>({
    resolver: zodResolver(serviceItemSchema),
    defaultValues: service,
  });

  useEffect(() => {
    if (open) {
      methods.reset(service);
    }
  }, [open, service, methods]);

  const onSubmit = async (data: ServiceItemType) => {
    setLoading(true);
    await onUpdate(data);
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
              <DialogTitle>Edit Service</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="serviceTitle">Service title</FormLabel>
                <FormField
                  name="title"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          id="serviceTitle"
                          placeholder="Service title"
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormLabel htmlFor="serviceDescription">
                  Service description
                </FormLabel>
                <FormField
                  name="desc"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          id="serviceDescription"
                          placeholder="Service description"
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormLabel htmlFor="cardColor">Card Color</FormLabel>
                <FormField
                  name="color"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="color" {...field} id="cardColor" />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
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
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </Form>
        </FormProviderWrapper>
      </DialogContent>
    </Dialog>
  );
}
