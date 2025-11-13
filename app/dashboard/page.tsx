"use client";

import React from "react";
import Card from "./components/Card";
import { FaFlag, FaMoneyBill } from "react-icons/fa6";
import { PiUsersFill } from "react-icons/pi";
import { SlBasket } from "react-icons/sl";
import { MdOutlineWbIncandescent } from "react-icons/md";
import Image from "next/image";
import SimpleAreaChart from "./components/SimpleAreaChart";

const data = [
  {
    name: "Apr",
    products: 23,
  },
  {
    name: "May",
    products: 10,
  },
  {
    name: "Jun",
    products: 12,
  },
  {
    name: "Jul",
    products: 42,
  },
  {
    name: "Aug",
    products: 52,
  },
  {
    name: "Sep",
    products: 64,
  },
  {
    name: "Oct",
    products: 61,
  },
  {
    name: "Nov",
    products: 75,
  },
  {
    name: "Dec",
    products: 99,
  },
];
const page = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-around gap-x-5 lg:flex-row">
        <Card
          iconBgColor="bg-purple-500"
          icon={FaMoneyBill}
          number="53,000"
          percentage={55}
          period="week"
          title="Today's Money"
        />
        <Card
          iconBgColor="bg-red-500"
          icon={PiUsersFill}
          number="2,300"
          percentage={3}
          period="week"
          title="Today's Users"
        />
        <Card
          iconBgColor="bg-green-500"
          icon={MdOutlineWbIncandescent}
          number="+3,462"
          percentage={-2}
          period="week"
          title="New Clients"
        />
        <Card
          iconBgColor="bg-pink-500"
          icon={SlBasket}
          number="103,430"
          percentage={5}
          period="week"
          title="Sales"
        />
      </div>
      <div className="flex my-6 gap-2">
        <div className="flex-3/5 rounded-2xl shadow-md">
          <SimpleAreaChart data={data} />
        </div>
        <div className="flex-2/5 relative">
          <div className="absolute bottom-2 left-2 text-white px-2 py-1 rounded">
            <span className="font-bold">Get started with Design</span>
            <p>
              There’s nothing I really wanted to do in life that I wasn’t able
              to get good at.
            </p>
          </div>

          <Image
            src="/startup.jpg"
            className="rounded-2xl object-cover w-full shadow-md"
            alt="startup"
            width={800}
            height={800}
          />
        </div>
      </div>

      <div className="my-6">
        <div className="bg-card rounded-2xl shadow-md">
          <div className="px-4 py-3 text-lg font-semibold border-b border-gray-200">
            Sales By Country
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-600">
              <thead className="sticky top-0">
                <tr className="text-center">
                  <th className="py-3 font-medium">Country</th>
                  <th className="py-3 font-medium">Sales</th>
                  <th className="py-3 font-medium">Value</th>
                  <th className="py-3 font-medium">Bounce</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="flex items-center justify-center gap-2 py-3">
                    <FaFlag className="text-cyan-600 w-4 h-4" />
                    <span>United States</span>
                  </td>
                  <td className="text-center">2500</td>
                  <td className="text-center">$230,900</td>
                  <td className="text-center">29.9%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="flex items-center justify-center gap-2 py-3">
                    <FaFlag className="text-blue-600 w-4 h-4" />
                    <span>France</span>
                  </td>
                  <td className="text-center">1800</td>
                  <td className="text-center">$150,300</td>
                  <td className="text-center">21.5%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="flex items-center justify-center gap-2 py-3">
                    <FaFlag className="text-yellow-600 w-4 h-4" />
                    <span>Germany</span>
                  </td>
                  <td className="text-center">2200</td>
                  <td className="text-center">$200,500</td>
                  <td className="text-center">25.2%</td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="flex items-center justify-center gap-2 py-3">
                    <FaFlag className="text-pink-600 w-4 h-4" />
                    <span>Brazil</span>
                  </td>
                  <td className="text-center">1900</td>
                  <td className="text-center">$175,800</td>
                  <td className="text-center">23.7%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
