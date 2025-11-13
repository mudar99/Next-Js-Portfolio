// src/app/portfolio/about/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-lg font-medium text-red-600">
        Something went wrong! 😢
      </h2>
      <button
        onClick={() => reset()}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Try again
      </button>
    </div>
  );
}
