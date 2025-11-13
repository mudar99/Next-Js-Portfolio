"use client";

import React from "react";
import Image from "next/image";
import EditHeroDialog from "./EditHeroDialog";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { MailIcon } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type Stat = { value: string; title: string };
type Profession = { title: string; image: File | string | null };
type Hero = {
  id: number;
  name: string;
  profession: string;
  emailLink: string;
  skillsSummary: string;
  image: File | string | null;
  cvFile: File | string | null;
  phrases: string[];
  stats: Stat[];
  professions: Profession[];
  createdAt?: string;
  updatedAt?: string;
};

export default function HeroPage() {
  const {
    data: hero,
    isLoading,
    error,
  } = useQuery<Hero>({
    queryKey: ["hero"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/hero");
      console.log(data);
      return data.data; // حسب شكل الريسبونس
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading hero</div>;

  return (
    <section className="py-12 mt-15 px-6 rounded-2xl shadow-sm bg-card text-card-foreground w-full border">
      <div className="relative">
        {/* Avatar */}
        <div className="absolute -top-30 left-1/2 transform -translate-x-1/2 w-64 h-64">
          {hero?.image && (
            <Image
              width={260}
              height={260}
              src={`${process.env.NEXT_PUBLIC_FILE_API}${hero.image}`}
              alt={hero.name}
              className="w-full h-full border-yellow-400 object-contain rounded-full shadow-md transition-transform duration-300"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {hero?.name}
              </h1>
              <p className="text-lg text-yellow-500 mt-1 font-medium">
                {hero?.profession}
              </p>
              {hero?.emailLink && (
                <div className="flex items-center gap-2">
                  <MailIcon className="h-6 mt-1" />
                  <span className="font-medium">{hero.emailLink}</span>
                </div>
              )}
            </div>
            {hero && <EditHeroDialog data={hero} />}
          </div>

          {/* Phrases */}
          {hero?.phrases?.length ? (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-center md:text-left">
                Phrases
              </h2>
              <ul className="space-y-1 list-disc list-inside">
                {hero.phrases.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Skills Summary */}
          {hero?.skillsSummary && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-center md:text-left">
                Skills Summary
              </h2>
              <p className="leading-relaxed">{hero.skillsSummary}</p>
            </div>
          )}

          {/* Statistics */}
          {hero?.stats?.length ? (
            <div>
              <h2 className="text-xl font-semibold mb-3 text-center md:text-left">
                Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {hero.stats.map((s, i) => (
                  <Card
                    key={i}
                    className="p-4 border rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <CardTitle className="text-3xl font-bold text-yellow-500">
                      {s.value ?? "-"}+
                    </CardTitle>
                    <CardDescription className="text-sm font-medium mt-1">
                      {s.title}
                    </CardDescription>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          {/* Skills */}
          {hero?.professions?.length ? (
            <div>
              <h2 className="text-xl font-semibold mb-3text-center md:text-left">
                Skills
              </h2>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start items-stretch">
                {hero.professions.map((p, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-24 h-24 overflow-hidden rounded-t-lg">
                      {p.image && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_FILE_API}${p.image}`}
                          width={96}
                          height={96}
                          alt={p.title}
                          className="object-cover w-full h-full rounded-full"
                        />
                      )}
                    </div>
                    <span className="text-sm mt-2 font-medium text-center">
                      {p.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
