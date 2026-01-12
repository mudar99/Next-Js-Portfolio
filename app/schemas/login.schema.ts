import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type LoginType = z.infer<typeof loginSchema>;
