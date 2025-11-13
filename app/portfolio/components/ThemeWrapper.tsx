"use client";

import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <body
      className={cn(
        `${geistSans.variable} ${geistMono.variable} antialiased mx-auto min-h-screen bg-linear-to-b transition-colors duration-500 text`,
        theme === "dark"
          ? "from-gray-900 to-black text-white"
          : "from-gray-100 to-white text-gray-900"
      )}
    >
      <div className="min-h-[70vh]">{children}</div>
    </body>
  );
}
