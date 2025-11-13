"use client";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { GoHomeFill } from "react-icons/go";
import { FaToggleOff, FaToggleOn } from "react-icons/fa6";
import { FaExclamationCircle, FaProjectDiagram } from "react-icons/fa";
import { PiCertificateFill } from "react-icons/pi";
import { ImPhone } from "react-icons/im";

const NavItem = ({
  href,
  label,
  active,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: React.ElementType;
  onClick: () => void;
}) => (
  <Link href={`/portfolio${href}`}>
    <li
      onClick={onClick}
      className={`
    relative flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer transition
    before:content-[''] 
    before:absolute 
    before:bottom-0 
    before:left-1/2 
    before:-translate-x-1/2 
    before:h-[3px] 
    before:bg-yellow-400 
    before:transition-all 
    before:duration-300 
    ${active ? "before:w-full" : "before:w-0 hover:before:w-full"}
  `}
    >
      <Icon />
      <span className="text-sm">{label}</span>
    </li>
  </Link>
);

const Navbar = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const [activePath, setActivePath] = useState(pathname);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  return (
    <nav className="flex align-middle justify-between text-gray-400">
      <div className="">
        <Image
          src={"/logo.png"}
          alt="mudar-logo"
          width={100}
          height={100}
        ></Image>
        <i
          className={`fa ${isMenuOpen ? "fa-times" : "fa-bars"}`}
          onClick={() => setIsMenuOpen((prevState) => !prevState)}
        ></i>
      </div>
      <ul
        className={`flex justify-between self-center gap-2 animate__animated ${
          isMenuOpen ? "animate__bounceInDown open" : "  closed"
        }`}
      >
        <NavItem
          icon={GoHomeFill}
          href="/"
          label="Home"
          active={activePath === "/"}
          onClick={() => setActivePath("/")}
        />

        <NavItem
          icon={FaExclamationCircle}
          href="/about"
          label="About"
          active={activePath === "/about"}
          onClick={() => setActivePath("/about")}
        />

        <NavItem
          icon={FaProjectDiagram}
          href="/projects"
          label="Projects"
          active={activePath === "/projects"}
          onClick={() => setActivePath("/projects")}
        />

        <NavItem
          icon={PiCertificateFill}
          href="/certificates"
          label="Certificates"
          active={activePath === "/certificates"}
          onClick={() => setActivePath("/certificates")}
        />

        <NavItem
          icon={ImPhone}
          href="/contact"
          label="Contact"
          active={activePath === "/skills"}
          onClick={() => setActivePath("/skills")}
        />
        <li
          className="py-2 px-4 rounded-md cursor-pointer transition"
          onClick={toggleTheme}
        >
          {/* {theme === "light" ? "🌙" : "🔆"} */}
          {theme === "light" ? (
            <FaToggleOn className="h-5 w-5" />
          ) : (
            <FaToggleOff className="h-5 w-5" />
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
