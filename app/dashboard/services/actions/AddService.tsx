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

interface AddServiceDialogProps {
  trigger: React.ReactNode;
  onAdd: (service: ServiceItemType) => Promise<unknown> | void;
}

export default function AddService({ trigger, onAdd }: AddServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm<ServiceItemType>({
    resolver: zodResolver(serviceItemSchema),
    defaultValues: {
      title: "",
      desc: "",
      color: "#000000",
    },
  });

  const onSubmit = async (service: ServiceItemType) => {
    console.log(service);
    setLoading(true);
    await onAdd(service);
    setLoading(false);
    setOpen(false);
  };
  console.log(methods.formState.errors);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="rounded-2xl bg-card border border-white/10">
        <FormProviderWrapper methods={methods}>
          <Form onSubmit={methods.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Service</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="grid gap-2">
                <FormLabel htmlFor="serviceTitle">Service title</FormLabel>
                <FormField
                  name="title"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Service title"
                          id="serviceTitle"
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormField
                  name="desc"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Description"
                          id="description"
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
                        <Input
                          type="color"
                          {...field}
                          id="cardColor"
                          placeholder="Card Color"
                        />
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
                {loading ? "Adding..." : "Add Service"}
              </Button>
            </DialogFooter>
          </Form>
        </FormProviderWrapper>
      </DialogContent>
    </Dialog>
  );
}
