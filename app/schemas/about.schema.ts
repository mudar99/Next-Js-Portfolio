import { z } from "zod";
import { validateImage } from "../utils/zodValidators";

// ------------------------------
// Main Schema
// ------------------------------
export const aboutSchema = z.object({
  bio: z.string().min(30, "Bio too short"),
  birthdate: z.coerce.date(),
  phone: z.string(),
  address: z.string(),
  honors: z.string().optional(),
  study: z.string().optional(),
  image: validateImage,
  createdAt: z.string(),
  updatedAt: z.string(),
  heroId: z.number(),

  hero: z.object({
    name: z.string(),
    emailLink: z.string().email(),
    cvFile: z.string().nullable(),
  }),
});

export type AboutType = z.infer<typeof aboutSchema>;
