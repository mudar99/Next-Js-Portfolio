import Image from "next/image";
import React from "react";
import TextType from "@/components/TextType";
import CountUp from "@/components/CountUp";
import Marquee from "react-fast-marquee";

export default async function page() {
  async function getHeroInfo() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hero`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch hero page information");
    const json = await res.json();
    return json.data;
  }
  const {
    phrases,
    cvFile,
    emailLink,
    image,
    name,
    profession,
    professions,
    skillsSummary,
    stats,
  } = await getHeroInfo();

  return (
    <main className="">
      <div className="flex flex-wrap items-center justify-between gap-10">
        <div className="min-w-[300px] ml-2 flex flex-col gap-2">
          <div className="title font-semibold">
            <p className="text-xl text-gray-300 tracking-widest uppercase">
              Hello there, welcome to my site
            </p>

            <div className="text-3xl font-bold text-yellow-400">
              I&apos;m {name}
            </div>
            <div className="text-3xl font-bold text-yellow-400">
              A {profession}
            </div>
          </div>

          <div className="leading-relaxed text-1xl mt-2">
            <TextType
              text={phrases}
              typingSpeed={50}
              pauseDuration={4000}
              showCursor={true}
              loop={true}
              cursorCharacter="█"
            />
          </div>

          <div className="flex gap-2">
            <a
              href={`${process.env.NEXT_PUBLIC_FILE_API}/download/${cvFile
                .split("/")
                .pop()}`}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:cursor-pointer inline-block text-center"
            >
              Download CV
            </a>

            <a
              href={`mailto:${emailLink}`}
              className="border border-yellow-400 text-white px-5 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:cursor-pointer"
            >
              Let&apos;s Work Together
            </a>
          </div>

          <div className="flex mt-2">
            <div className="flex gap-6 bg-white/5 rounded-2xl p-6 justify-center">
              {stats.map((item: { title: string; value: number }) => (
                <div key={item.title} className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    <CountUp from={0} to={item.value} duration={1.2} />+
                  </div>
                  <span className="text-gray-300 text-sm mt-1">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="">
          <Image
            width={300}
            height={300}
            className="rounded-2xl object-cover w-auto"
            src={`${process.env.NEXT_PUBLIC_FILE_API}${image}`}
            alt="mudar-home"
            loading="eager"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold my-6 text-center">My Skills</h2>
      <p className="text-md text-center text-pretty max-w-3xl mx-auto">
        {skillsSummary}
      </p>
      <div className="my-12">
        <Marquee speed={100} direction="left" pauseOnHover autoFill>
          {professions.map(
            (service: { title: string; image: string }, i: number) => (
              <div key={i} className="mx-10">
                <div className="flex flex-col items-center">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_FILE_API}${service.image}`}
                    width={80}
                    height={80}
                    alt={service.title}
                    className="object-contain"
                  />
                  <h2 className="text-sm font-semibold mt-4">
                    {service.title}
                  </h2>
                </div>
              </div>
            )
          )}
        </Marquee>
      </div>
    </main>
  );
}
