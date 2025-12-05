import z from "zod";

// Allowed image MIME types
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

// Allowed CV types
const CV_TYPES = ["application/pdf"];
const CV_EXTENSIONS = [".pdf"];

// Helper: Validate File OR existing string
const validateImage = z
  .union([z.instanceof(File), z.string().nullable()])
  .optional()
  .refine((val) => {
    if (!val) return true;

    // CASE 1: string from backend
    if (typeof val === "string") {
      return IMAGE_EXTENSIONS.some((ext) => val.toLowerCase().endsWith(ext));
    }

    // CASE 2: File from form
    return IMAGE_TYPES.includes(val.type);
  }, "Invalid image format. Allowed: PNG, JPG, JPEG, WEBP");

const validateCV = z
  .union([z.instanceof(File), z.string().nullable()])
  .optional()
  .refine((val) => {
    if (!val) return true;

    // CASE 1: existing cv from backend
    if (typeof val === "string") {
      return CV_EXTENSIONS.some((ext) => val.toLowerCase().endsWith(ext));
    }

    // CASE 2: File upload
    return CV_TYPES.includes(val.type);
  }, "Invalid CV file. Only PDF allowed.");

export { validateCV, validateImage };
