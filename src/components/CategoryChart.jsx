import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import categories from "../data/categories";
import { groupByCategory } from "../utils/calculations";

export default function CategoryChart({ expenses }) {
  const grouped = groupByCategory(expenses);
  const data = categories
    .map((cat) => ({
      name: cat.label,
      value: grouped[cat.id] || 0,
      color: cat.color,
    }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-calm-200 p-6">
        <h2 className="text-lg font-semibold text-calm-900 mb-4">
          Spending by Category
        </h2>
        <div className="flex items-center justify-center h-48 text-calm-400 text-sm">
          No data for this period
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-calm-200 p-6"
      role="img"
      aria-labelledby="category-chart-title"
    >
      <h2
        id="category-chart-title"
        className="text-lg font-semibold text-calm-900 mb-4"
      >
        Spending by Category
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            animationBegin={200}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e0dceb",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: "14px",
            }}
            formatter={(value) => `₦${Number(value).toLocaleString()}`}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-calm-600 text-sm">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
