import { z } from "zod";
import { validateCV, validateImage } from "../utils/zodValidators";

export const heroSchema = z.object({
  name: z.string().min(2),
  profession: z.string().min(5),
  skillsSummary: z.string().min(10),
  emailLink: z.string().email({ message: "Email not valid" }),

  image: validateImage,
  cvFile: validateCV,

  phrases: z.array(z.string().min(10)).min(1).max(3),

  stats: z
    .array(
      z.object({
        title: z.string().min(1),
        value: z.number().min(1).max(999),
      })
    )
    .min(2)
    .max(4),

  professions: z
    .array(
      z.object({
        title: z.string().min(1),
        image: validateImage,
      })
    )
    .min(2),
});

export type HeroType = z.infer<typeof heroSchema>;
