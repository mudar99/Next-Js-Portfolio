"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";

type NavbarProps = {
  className?: string; // className is optional
};

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div
      className={`${className} flex justify-between items-center mx-8 text-white`}
    >
      <div>
        <div>
          <span className="text-gray-300">Pages </span>
          <span className="text-white">/ Somethin</span>
        </div>
        <span className="font-bold">Dashboard</span>
      </div>
      <div className=" flex items-center gap-3">
        <input
          className="bg-white h-10 rounded-md text-black px-3 focus:outline-0"
          placeholder="Type Here"
          type="text"
        />
        <button className="p-2 rounded-lg cursor-pointer hover:bg-purple-50 hover:text-blue-500 ">
          Search
        </button>
        <div
          className="py-2 px-4 rounded-md cursor-pointer transition"
          onClick={toggleTheme}
        >
          {theme === "light" ? "🌙" : "🔆"}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
