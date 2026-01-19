export const isoToHumanDate = (iso?: string ) => {
  if (!iso) return "";

  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
};
