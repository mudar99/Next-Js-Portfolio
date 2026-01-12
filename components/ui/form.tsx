"use client";

import * as React from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldError,
  FieldValues,
  FormProvider,
  Path,
  useFormContext,
  UseFormReturn,
  Control,
} from "react-hook-form";

/* ---------------- FORM WRAPPER ---------------- */
export function Form({
  children,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) {
  return <form {...props}>{children}</form>;
}

/* ---------------- PROVIDER WRAPPER ---------------- */
export function FormProviderWrapper<TFormValues extends FieldValues>({
  methods,
  children,
}: {
  methods: UseFormReturn<TFormValues>;
  children: React.ReactNode;
}) {
  return <FormProvider {...methods}>{children}</FormProvider>;
}

/* ---------------- FIELD COMPONENT ---------------- */
export function FormField<
  TFormValues extends FieldValues,
  TFieldName extends Path<TFormValues>
>({
  name,
  control,
  render,
}: {
  name: TFieldName;
  control?: Control<TFormValues>;
  render: (args: {
    field: ControllerRenderProps<TFormValues, TFieldName>;
    fieldState: { error?: FieldError };
    formState: UseFormReturn<TFormValues>["formState"];
  }) => React.ReactElement; // IMPORTANT
}) {
  const context = useFormContext<TFormValues>();

  const usedControl = control ?? context.control;

  return (
    <Controller
      name={name}
      control={usedControl}
      render={({ field, fieldState, formState }) =>
        render({ field, fieldState, formState })
      }
    />
  );
}

/* ---------------- UI HELPERS ---------------- */
export function FormItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`flex flex-col gap-1 ${className}`}>{children}</div>;
}

export function FormLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-gray-200">
      {children}
    </label>
  );
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function FormMessage({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-red-400 text-sm">{children}</p>;
}
