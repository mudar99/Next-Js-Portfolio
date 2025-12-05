import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function ProjectPage() {
  async function getCertificates() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certificates`, {
      cache: "no-store",
    });
    if (!res.ok)
      throw new Error("Failed to fetch certificates page information");
    const json = await res.json();
    return json.data;
  }

  const certificates = await getCertificates();

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {certificates.map(
        (item: {
          id: number;
          title: string;
          link: string;
          image: string | null;
        }) => (
          <Link
            target="_blank"
            rel="noopener noreferrer"
            key={item.id}
            href={`${item.link}`}
          >
            <div className="group block transform transition duration-500 hover:scale-105">
              <div className="relative bg-white/5 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full">
                <div className="flex justify-center">
                  {item.image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_FILE_API}${item.image}`}
                      width={150}
                      height={150}
                      alt={item.title}
                      className="object-cover w-full h-full shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-36 h-36 bg-gray-200 rounded-full flex items-center justify-center text-lg font-medium">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-200 group-hover:text-yellow-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 mt-2">{item.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )
      )}
    </div>
  );
}
