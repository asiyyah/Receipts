import { motion } from 'framer-motion'
import { calculateTotal, formatCurrency } from '../utils/calculations'

export default function SummaryCard({ expenses }) {
  const total = calculateTotal(expenses)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-calm-700 to-calm-900 rounded-2xl p-6 text-white shadow-lg"
    >
      <p className="text-calm-200 text-sm font-medium uppercase tracking-wide">
        Total Spent
      </p>
      <p className="text-3xl font-bold mt-2">{formatCurrency(total)}</p>
      <p className="text-calm-300 text-sm mt-1">
        {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
      </p>
    </motion.div>
  )
}
