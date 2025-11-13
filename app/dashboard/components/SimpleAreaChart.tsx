import React from "react";
import {
  AreaChart,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";

interface ChartData {
  name: string;
  products: number;
}

interface Props {
  data: ChartData[];
}

const SimpleAreaChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-full p-4 bg-card rounded-2xl text-sm ">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 9" />
          <XAxis dataKey="name" axisLine={false} />
          <Tooltip />
          <Line
            type="monotone"
            strokeWidth={3}
            dot={false}
            dataKey="products"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleAreaChart;
