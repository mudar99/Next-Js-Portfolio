"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { HeroType, heroSchema } from "@/app/schemas/hero.schema";
import { objectToFormData } from "@/app/utils/objectToForm";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
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
import Image from "next/image";

type Props = {
  data: HeroType;
};

export default function EditHeroDialog({ data }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  /* ---------------- RHF ---------------- */
  const methods = useForm<HeroType>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      ...data,
      image: data.image ?? null,
      cvFile: data.cvFile ?? null,
      phrases: data.phrases ?? [],
      stats: data.stats ?? [],
      professions: data.professions ?? [],
    },
  });

  /* ---------------- Field Arrays ---------------- */
  const phrases = methods.watch("phrases");

  const addPhrase = async () => {
    const current = methods.getValues("phrases");
    methods.setValue("phrases", [...current, ""]);
    await methods.trigger("phrases");
  };

  const removePhrase = (index: number) => {
    methods.setValue(
      "phrases",
      phrases.filter((_, i) => i !== index)
    );
  };

  const stats = useFieldArray({
    control: methods.control,
    name: "stats",
  });

  const professions = useFieldArray({
    control: methods.control,
    name: "professions",
  });

  /* ---------------- Mutation ---------------- */
  const mutation = useMutation({
    mutationFn: async (body: FormData) => {
      const res = await axiosInstance.put("/hero", body);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero"] });
      toast.success("Hero section updated successfully");
    },
    onError: () => toast.error("Something went wrong"),
  });

  const onSubmit = (data: HeroType) => {
    console.log(data);
    const form = objectToFormData(data);
    mutation.mutate(form);
    setOpen(false);
  };

  /* ---------------- UI ---------------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Hero Section</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <FormProviderWrapper methods={methods}>
          <Form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="grid gap-6 p-2"
          >
            <DialogHeader>
              <DialogTitle>Edit Hero Section</DialogTitle>
              <DialogDescription>
                Update hero content and files.
              </DialogDescription>
            </DialogHeader>

            {/* ---------------- Basic Fields ---------------- */}
            {(
              ["name", "profession", "skillsSummary", "emailLink"] as const
            ).map((fieldName) => {
              // map للأسماء لعرض Label أحسن
              const labels: Record<typeof fieldName, string> = {
                name: "Full Name",
                profession: "Profession",
                skillsSummary: "Skills Summary",
                emailLink: "Email",
              };

              return (
                <div key={fieldName} className="space-y-1">
                  <FormField
                    name={fieldName}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{labels[fieldName]}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}

            {/* ---------------- Files ---------------- */}
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
                  {field.value && (
                    <div className="mt-2 flex justify-center">
                      {typeof field.value === "string" ? (
                        <Image
                          width={300}
                          height={300}
                          src={process.env.NEXT_PUBLIC_FILE_API + field.value}
                          alt="Existing file"
                          className="w-25 h-25 object-contain rounded-md"
                        />
                      ) : (
                        <Image
                          width={300}
                          height={300}
                          src={URL.createObjectURL(field.value)}
                          alt="New file preview"
                          className="w-25 h-25 object-contain rounded-md"
                        />
                      )}
                    </div>
                  )}
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              name="cvFile"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>CV (PDF)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] ?? null)
                      }
                    />
                  </FormControl>
                  {field.value && (
                    <div className="mt-2 flex justify-center text-sm text-gray-300">
                      {typeof field.value === "string" ? (
                        <p>{field.value.split("/").pop()}</p>
                      ) : (
                        <p>{field.value.name}</p>
                      )}
                    </div>
                  )}
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* ---------------- Phrases ---------------- */}
            <fieldset className="space-y-2">
              <Label>Phrases</Label>

              {phrases.map((_, idx) => (
                <div key={idx} className="flex gap-2">
                  <FormField
                    name={`phrases.${idx}`}
                    render={({ field, fieldState }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    disabled={phrases.length === 1}
                    variant="destructive"
                    onClick={() => removePhrase(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={phrases.length >= 3}
                onClick={() => addPhrase()}
              >
                <Plus />
              </Button>
              <FormMessage>
                {methods.formState.errors.phrases?.root?.message}
              </FormMessage>
            </fieldset>

            {/* ---------------- Stats ---------------- */}
            <fieldset className="space-y-2">
              <Label>Statistics</Label>

              {stats.fields.map((_, idx) => (
                <div key={idx} className="flex gap-2">
                  <FormField
                    name={`stats.${idx}.title`}
                    render={({ field, fieldState }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="Title" />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`stats.${idx}.value`}
                    render={({ field, fieldState }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="number" {...field} placeholder="Value" />
                        </FormControl>
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    disabled={stats.fields.length <= 2}
                    variant="destructive"
                    onClick={() => stats.remove(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                disabled={stats.fields.length >= 4}
                size="icon"
                onClick={() => stats.append({ title: "", value: "0" })}
              >
                <Plus />
              </Button>
              <FormMessage>
                {methods.formState.errors.stats?.root?.message}
              </FormMessage>
            </fieldset>

            {/* ---------------- Professions ---------------- */}
            <fieldset className="space-y-2">
              <Label>Professions</Label>

              <div className="flex flex-wrap justify-center items-start gap-3">
                {professions.fields.map((_, idx) => (
                  <div
                    key={idx}
                    className="border p-4 rounded-2xl flex flex-col gap-2"
                  >
                    <FormField
                      name={`professions.${idx}.title`}
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Title" {...field} />
                            <FormMessage>
                              {fieldState.error?.message}
                            </FormMessage>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name={`professions.${idx}.image`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                field.onChange(e.target.files?.[0] ?? null)
                              }
                            />
                          </FormControl>

                          {/* Preview للملف القديم أو الجديد */}
                          {field.value && (
                            <div className="mt-2 flex justify-center">
                              {typeof field.value === "string" ? (
                                <Image
                                  width={300}
                                  height={300}
                                  src={
                                    process.env.NEXT_PUBLIC_FILE_API +
                                    field.value
                                  }
                                  alt="Existing file"
                                  className="w-25 h-25 object-contain rounded-md"
                                />
                              ) : (
                                <Image
                                  width={300}
                                  height={300}
                                  src={URL.createObjectURL(field.value)}
                                  alt="New file preview"
                                  className="w-25 h-25 object-contain rounded-md"
                                />
                              )}
                            </div>
                          )}

                          <FormMessage>{fieldState.error?.message}</FormMessage>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => professions.remove(idx)}
                    >
                      Delete <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => professions.append({ title: "", image: null })}
              >
                <Plus />
              </Button>
              <FormMessage>
                {methods.formState.errors.professions?.root?.message}
              </FormMessage>
            </fieldset>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                Save changes
              </Button>
            </DialogFooter>
          </Form>
        </FormProviderWrapper>
      </DialogContent>
    </Dialog>
  );
}
