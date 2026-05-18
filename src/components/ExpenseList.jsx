import { motion, AnimatePresence } from 'framer-motion'
import categories from '../data/categories'
import { formatDate } from '../utils/dateHelpers'
import { formatCurrency } from '../utils/calculations'

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-calm-200 p-6">
        <h2 className="text-lg font-semibold text-calm-900 mb-4">Recent Transactions</h2>
        <div className="flex items-center justify-center h-24 text-calm-400 text-sm">
          No transactions yet
        </div>
      </div>
    )
  }

  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-calm-200 p-6">
      <h2 className="text-lg font-semibold text-calm-900 mb-4">Recent Transactions</h2>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {sorted.map((expense, index) => {
            const cat = categories.find((c) => c.id === expense.category)
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-calm-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{cat?.emoji || '📦'}</span>
                  <div>
                    <p className="text-sm font-medium text-calm-900">
                      {cat?.label || 'Other'}
                    </p>
                    <p className="text-xs text-calm-400">{formatDate(expense.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-calm-800">
                    {formatCurrency(expense.amount)}
                  </span>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-calm-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
