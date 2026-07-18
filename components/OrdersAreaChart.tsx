"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function OrdersAreaChart({ allOrders }: { allOrders: any[] }) {
  const ordersPerDay = allOrders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toISOString().split("T")[0];

    acc[date] = (acc[date] || 0) + 1;

    return acc;
  }, {});

  const chartData = Object.entries(ordersPerDay).map(([date, count]) => ({
    date,
    orders: count,
  }));

  return (
    <div className='w-full max-w-4xl h-[300px]'>
      <h3 className='text-lg font-medium text-slate-800 mb-4'>
        <span className='text-slate-500'>Orders /</span> Day
      </h3>

      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' />

          <XAxis dataKey='date' />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Area
            type='monotone'
            dataKey='orders'
            stroke='#4f46e5'
            fill='#8884d8'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
    