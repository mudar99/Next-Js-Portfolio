import { z } from "zod";
import { validateCV, validateImage } from "../utils/zodValidators";

// ------------------------------
// Main Schema
// ------------------------------
export const heroSchema = z.object({
  name: z.string().min(2),
  profession: z.string().min(2),
  skillsSummary: z.string().min(2),
  emailLink: z.string().email({ message: "Email not valid" }),

  image: validateImage,
  cvFile: validateCV,

  phrases: z.array(z.string().min(1)).min(1).max(3),

  stats: z
    .array(
      z.object({
        title: z.string().min(1),
        value: z.coerce.number().min(1),
      })
    )
    .min(2)
    .max(4),

  professions: z.array(
    z.object({
      title: z.string().min(1),
      image: validateImage,
    })
  ),
});

export type HeroType = z.infer<typeof heroSchema>;
