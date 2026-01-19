import { z } from "zod";
import { validateImage } from "../utils/zodValidators";

export const aboutSchema = z.object({
  bio: z
    .string()
    .trim()
    .min(30, "Bio must be at least 30 characters")
    .max(1000, "Bio must not exceed 1000 characters"),

  birthdate: z
    .string()
    .refine((val) => !isNaN(new Date(val).getTime()), "Invalid date")
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      if (date >= today) return false;

      const age =
        today.getFullYear() -
        date.getFullYear() -
        (today < new Date(today.getFullYear(), date.getMonth(), date.getDate())
          ? 1
          : 0);

      return age >= 10 && age <= 100;
    }, "Invalid age"),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number too short")
    .max(20, "Phone number too long")
    .regex(/^[0-9+\-()\s]+$/, "Invalid phone number format"),

  address: z
    .string()
    .trim()
    .min(5, "Address too short")
    .max(255, "Address too long"),

  honors: z
    .string()
    .trim()
    .min(3, "Honors too short")
    .max(255, "Honors too long")
    .optional(),

  study: z
    .string()
    .trim()
    .min(3, "Study too short")
    .max(255, "Study too long")
    .optional(),

  image: validateImage,

  createdAt: z.string().datetime("Invalid created date"),
  updatedAt: z.string().datetime("Invalid updated date"),

  heroId: z.number().int().positive(),

  hero: z.object({
    name: z.string().min(2),
    emailLink: z.string().email("Invalid email"),
    cvFile: z.string().nullable(),
  }),
});

export type AboutType = z.infer<typeof aboutSchema>;
