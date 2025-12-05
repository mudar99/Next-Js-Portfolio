import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function ProjectPage() {
  async function getProjects() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch projects page information");
    const json = await res.json();
    return json.data;
  }

  const projects = await getProjects();

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {projects.map(
        (item: {
          id: number;
          title: string;
          projectName: string;
          thumbnail: string | null;
        }) => (
          <Link key={item.id} href={`/portfolio/projects/${item.id}`}>
            <div className="group block transform transition duration-500 hover:scale-105">
              <div className="relative bg-white/5 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full">
                <div className="flex justify-center h-50 w-full">
                  {item.thumbnail ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_FILE_API}${item.thumbnail}`}
                      width={150}
                      height={150}
                      alt={item.projectName}
                      className="object-cover w-full h-full shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-50 w-full bg-gray-500 flex items-center justify-center text-lg font-medium">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-200 group-hover:text-yellow-400 transition-colors duration-300">
                      {item.projectName}
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
