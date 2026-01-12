"use client";
import Image from "next/image";
import React from "react";
import { BiUser } from "react-icons/bi";
import { GoHome } from "react-icons/go";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { PiCertificate } from "react-icons/pi";
import { RiDashboard2Line, RiServiceLine } from "react-icons/ri";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { LuPhone } from "react-icons/lu";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import Link from "next/link";

type SidebarProps = {
  className?: string; // className is optional
};

const SideItem = ({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
}) => (
  <Link href={`/dashboard${href}`}>
    <li className="flex items-center gap-2 py-2 px-4 hover:bg-gray-100 rounded-md hover:cursor-pointer">
      <Icon className="w-5 h-5" />
      <span className="text-sm">{label}</span>
    </li>
  </Link>
);

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <aside
      className={`${className} w-[250px] h-[90vh] bg-card text-foreground my-4 ml-5 rounded-2xl z-50 shadow-sm`}
    >
      <div className="flex items-center justify-center">
        <Image
          src="/logo.png"
          className="logo"
          alt="logo"
          width={80}
          height={80}
        />
        <div className="font-semibold">Control Panel</div>
      </div>
      <div className="mx-2">
        <ul>
          <SideItem icon={RiDashboard2Line} label="Dashboard" href={"/"} />
          <SideItem icon={GoHome} label="Hero" href={"/hero"} />
          <SideItem
            icon={HiOutlineExclamationCircle}
            label="About"
            href={"/about"}
          />
          <SideItem icon={RiServiceLine} label="Services" href={"/services"} />
          <SideItem
            icon={LiaProjectDiagramSolid}
            label="Projects"
            href={"/projects"}
          />
          <SideItem
            icon={PiCertificate}
            label="Certificates"
            href={"/certificates"}
          />
          <SideItem icon={LuPhone} label="Contact" href={"/contact"} />
        </ul>
      </div>
      <h2 className="ml-6 my-3 font-semibold">Other</h2>
      <div className="mx-2">
        <ul>
          <SideItem icon={BiUser} label="Profile" href={"/"} />
          <SideItem icon={IoMdLogIn} label="Sign In" href={"/"} />
          <SideItem icon={IoMdLogOut} label="Sign Up" href={"/"} />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
