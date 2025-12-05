export function objectToFormData(
  obj: unknown,
  form?: FormData,
  parentKey?: string
) {
  const formData = form || new FormData();

  if (obj === null || obj === undefined) return formData;

  Object.entries(obj).forEach(([key, value]) => {
    const fieldKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value === null || value === undefined) return;

    // Convert Date to string
    if (value instanceof Date) {
      formData.append(fieldKey, value.toISOString()); // أو أي صيغة تحبها
      return;
    }

    // If value is a File or Blob
    if (value instanceof File || value instanceof Blob) {
      formData.append(fieldKey, value);
      return;
    }

    // If value is an array
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayKey = `${fieldKey}[${index}]`;

        if (item instanceof Date) {
          formData.append(arrayKey, item.toISOString());
        } else if (item instanceof File || item instanceof Blob) {
          formData.append(arrayKey, item);
        } else if (typeof item === "object") {
          objectToFormData(item, formData, arrayKey);
        } else {
          formData.append(arrayKey, item);
        }
      });
      return;
    }

    // If value is a nested object
    if (typeof value === "object") {
      objectToFormData(value, formData, fieldKey);
      return;
    }

    // Primitive values
    formData.append(fieldKey, value);
  });

  return formData;
}
