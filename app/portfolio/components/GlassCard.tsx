import Image from "next/image";
import React from "react";

export interface GlassCardProps {
  title: string;
  description: string;
  image: string;
  className?: string;
}

export default function GlassCard({
  title,
  description,
  image,
  className = "",
}: GlassCardProps) {
  return (
    <article
      className={`${className} flex flex-col justify-between gap-3 w-[260px] h-[320px] p-3 rounded-2xl bg-gray-800
      backdrop-blur-md transition-all duration-300`}
    >
      <div className="relative h-[150px] flex justify-center">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h5>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide mt-2 line-clamp-4">
        {description}
      </p>
    </article>
  );
}
