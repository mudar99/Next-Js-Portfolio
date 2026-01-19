"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

import { aboutSchema, AboutType } from "@/app/schemas/about.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormProviderWrapper,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { isoToHumanDate } from "@/app/utils/date.utils";

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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm<AboutType>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      ...data,
      birthdate: isoToHumanDate(data.birthdate),
      image: data.image ?? null,
    },
  });

  const imageValue = methods.watch("image");

  const onSubmit = async (values: AboutType) => {
    setLoading(true);
    try {
      await onUpdate(values);
      setOpen(false);
      methods.reset(values);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <FormProviderWrapper methods={methods}>
          <Form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="grid gap-6 p-2"
          >
            <DialogHeader>
              <DialogTitle>Edit About Info</DialogTitle>
              <DialogDescription>
                Update about me information.
              </DialogDescription>
            </DialogHeader>

            <FormField
              name="bio"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Whatsapp</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="address"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="birthdate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Birthdate</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="honors"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Honors</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="study"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Study</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="image"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] ?? null)
                      }
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>

                  {imageValue && (
                    <div className="mt-2">
                      {typeof imageValue === "string" ? (
                        <Image
                          src={process.env.NEXT_PUBLIC_FILE_API + imageValue}
                          alt="preview"
                          width={300}
                          height={300}
                          className="w-32 h-32 object-contain rounded-md"
                        />
                      ) : (
                        <Image
                          src={URL.createObjectURL(imageValue)}
                          alt="new preview"
                          width={300}
                          height={300}
                          className="w-32 h-32 object-contain rounded-md"
                        />
                      )}
                    </div>
                  )}
                </FormItem>
              )}
            />

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
