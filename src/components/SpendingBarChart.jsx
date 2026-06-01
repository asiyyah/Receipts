import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { getLast7Days, getDayLabel } from "../utils/dateHelpers";
import { dailyTotals, formatCurrency } from "../utils/calculations";

export default function SpendingBarChart({ expenses }) {
  const days = getLast7Days();
  const data = dailyTotals(expenses, days).map((d) => ({
    day: getDayLabel(d.date),
    fullDate: d.date,
    total: d.total,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-calm-200 p-6"
      role="img"
      aria-labelledby="daily-spending-chart-title"
    >
      <h2
        id="daily-spending-chart-title"
        className="text-lg font-semibold text-calm-900 mb-4"
      >
        Daily Spending
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0eef5"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8a7caa", fontSize: 13 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8a7caa", fontSize: 13 }}
            tickFormatter={(v) => `₦${v}`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e0dceb",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: "14px",
            }}
            formatter={(value) => formatCurrency(value)}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) return payload[0].payload.fullDate;
              return label;
            }}
          />
          <Bar
            dataKey="total"
            fill="#A78BFA"
            radius={[6, 6, 0, 0]}
            animationBegin={400}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
