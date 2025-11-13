import React from "react";

type TailwindBgColor =
  | "bg-blue-500"
  | "bg-green-500"
  | "bg-red-500"
  | "bg-yellow-500"
  | "bg-purple-500"
  | "bg-pink-500"
  | "bg-gray-500";

type CardProps = {
  title: string;
  icon: React.ElementType;
  number: string;
  percentage: number;
  period: "yesterday" | "week" | "quarter" | "month";
  className?: string;
  iconBgColor?: TailwindBgColor;
};

const Card: React.FC<CardProps> = ({
  title,
  icon: Icon,
  number,
  percentage,
  period,
  className,
  iconBgColor,
}) => {
  return (
    <div className={`${className} p-4 rounded-2xl shadow bg-card w-full`}>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-1xl font-semibold text-gray-500">
            {title.toUpperCase()}
          </div>
          <div className="text-2xl font-bold">{number}</div>
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgColor}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm text-gray-500">
          <span
            className={`font-bold text-base ${
              percentage > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {percentage > 0 ? "+" : ""}
            {percentage}% &nbsp;
          </span>
          <span className="text-base">from {period}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
