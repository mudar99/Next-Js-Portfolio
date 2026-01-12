import { z } from "zod";

export const serviceItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(30),
  desc: z.string().min(1).max(200),
  color: z.string().min(1),
});

export type ServiceItemType = z.infer<typeof serviceItemSchema>;

export const servicesSchema = z.object({
  servicesSummary: z.string().min(1),
  services: z.array(serviceItemSchema).min(2).max(4),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ServicesType = z.infer<typeof servicesSchema>;
