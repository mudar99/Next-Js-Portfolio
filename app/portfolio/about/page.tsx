import Image from "next/image";
import React from "react";
import { IoLocationSharp, IoMail } from "react-icons/io5";
import { FaGraduationCap, FaMedal } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import SpotlightCard from "@/components/SpotlightCard";
import { FaBirthdayCake } from "react-icons/fa";

export default async function AboutPage() {
  async function getAboutInfo() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/about`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch hero page information");
    const json = await res.json();
    return json.data;
  }

  const { bio, birthdate, phone, address, honors, study, hero } =
    await getAboutInfo();

  const InfoItem = ({
    icon: Icon,
    color,
    title,
    value,
  }: {
    icon: React.ElementType;
    color: string;
    title: string;
    value: string;
  }) => (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center rounded-full h-9 w-9 shrink-0"
        style={{ backgroundColor: color }}
      >
        <Icon className="text-white h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold truncate">{title}</h2>
        <p className="text-sm text-gray-300 wrap-break-word">{value}</p>
      </div>
    </div>
  );

  const infoData = [
    {
      icon: IoLocationSharp,
      color: "#ec4899",
      title: "Address:",
      value: address,
    },
    {
      icon: IoMail,
      color: "#f87171",
      title: "Email:",
      value: hero.emailLink,
    },
    {
      icon: IoLogoWhatsapp,
      color: "#22c55e",
      title: "Whatsapp:",
      value: phone,
    },
    {
      icon: FaBirthdayCake,
      color: "#a855f7",
      title: "Date of birth:",
      value: birthdate,
    },
    {
      icon: FaMedal,
      color: "#eab308",
      title: "Honors:",
      value: honors,
    },
    {
      icon: FaGraduationCap,
      color: "#1f2937",
      title: "Study:",
      value: study,
    },
  ];

  return (
    <>
      {/* bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 */}
      <section className="relative overflow-hidden py-24 px-6 border text-white rounded-3xl shadow-xl">
        {/* Background decoration */}
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,0,0.15),transparent_60%)]"></div> */}
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,0,0.1),transparent_60%)]"></div> */}

        {/* Content */}
        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left: Image */}
          <div className="relative shrink-0">
            {/* <div className="absolute inset-0 blur-3xl bg-yellow-400/20 rounded-full"></div> */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl hover:scale-105 transition-transform duration-500">
              <Image
                src="/1.jpg"
                alt="Mudar Abo Fakher"
                width={256}
                height={256}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-bold text-yellow-400 drop-shadow-lg">
              {hero.name}
            </h2>
            <p className="text-lg text-gray-200 leading-relaxed">{bio}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {infoData.map((item, index) => (
                <InfoItem key={index} {...item} />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-center md:justify-start gap-4 pt-4">
              <a
                href={`${
                  process.env.NEXT_PUBLIC_FILE_API
                }/download/${hero.cvFile.split("/").pop()}`}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:cursor-pointer inline-block text-center"
              >
                Download CV
              </a>

              <a
                href={`mailto:${hero.emailLink}`}
                className="border border-yellow-400 text-white px-5 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:cursor-pointer"
              >
                Let&apos;s Work Together
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold my-6 text-center">My Services</h2>
        <p className="text-md text-center text-pretty max-w-3xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique
          labore consequatur molestias eligendi nesciunt aut obcaecati deserunt
          quam ea temporibus placeat maxime, nulla, pariatur atque repellat
          illum. Ad velit a ipsum quis.
        </p>
        <div className="my-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <SpotlightCard spotlightColor="oklch(85% 0.22 85)">
            <h2 className="text-2xl font-bold text-yellow-400 mb-3 ">
              Frontend Development
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Building dynamic, high-performance web applications using Focused
              on creating fast, maintainable, and elegant UIs.
            </p>
          </SpotlightCard>

          {/* Card 2 */}
          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="oklch(80% 0.2 250)" // cyan-blue
          >
            <h2 className="text-2xl font-bold text-sky-400 mb-3">
              UI/UX Design & Animation
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Transforming concepts into intuitive experiences with value
              minimalism, motion, and micro-interactions that feel alive.
            </p>
          </SpotlightCard>

          {/* Card 3 */}
          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="oklch(80% 0.2 160)" // green
          >
            <h2 className="text-2xl font-bold text-emerald-400 mb-3">
              Clean Architecture
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Writing maintainable, scalable front-end systems using , and a
              modular folder structure. I aim for clarity, testability, and
              long-term stability.
            </p>
          </SpotlightCard>

          <SpotlightCard
            className="custom-spotlight-card "
            spotlightColor="oklch(85% 0.22 85)" // yellow-gold
          >
            <h2 className="text-2xl font-bold text-yellow-400 mb-3 ">
              Frontend Development
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Building dynamic, high-performance web applications using Focused
              on creating fast, maintainable, and elegant UIs.
            </p>
          </SpotlightCard>
        </div>
      </section>
    </>
  );
}
