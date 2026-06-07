"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function FatigueTimeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
    <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="time" />
    <YAxis />
    <Tooltip />

    <Line
      type="monotone"
      dataKey="count"
      stroke="#b88b5a"
      strokeWidth={3}
      dot={{ r: 5 }}
    />
  </LineChart>
  </ResponsiveContainer>
  );
}