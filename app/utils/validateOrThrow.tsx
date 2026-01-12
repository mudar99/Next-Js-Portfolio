import { toast } from "sonner";
import z from "zod";

export function validateOrThrow<T>(schema: z.ZodType<T>, payload: unknown): T {
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    toast.error(
      <ul className="list-disc pl-5">
        {parsed.error.issues.map((err, idx) => (
          <li key={idx}>
            <strong>{err.path.join(".").toUpperCase()}:</strong> {err.message}
          </li>
        ))}
      </ul>
    );

    throw new Error("Validation failed");
  }

  return parsed.data;
}
