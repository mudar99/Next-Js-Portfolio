import { z } from "zod";

export const servicesSummarySchema = z.object({
  servicesSummary: z
    .string()
    .trim()
    .min(1, "Summary is required")
    .max(300, "Summary is too long"),
});

export type ServicesSummaryType = z.infer<typeof servicesSummarySchema>;

export const serviceItemSchema = z.object({
  id: z.number().int().positive().optional(),

  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(30, "Title is too long"),

  desc: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(250, "Description is too long"),

  color: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Invalid color"),
});

export type ServiceItemType = z.infer<typeof serviceItemSchema>;

export const servicesSchema = z.object({
  servicesSummary: z
    .string()
    .trim()
    .min(1, "Summary is required")
    .max(300, "Summary is too long"),

  services: z
    .array(serviceItemSchema)
    .min(2, "At least 2 services required")
    .max(24, "Maximum 24 services allowed"),

  createdAt: z.string().datetime("Invalid created date"),
  updatedAt: z.string().datetime("Invalid updated date"),
});

export type ServicesType = z.infer<typeof servicesSchema>;
