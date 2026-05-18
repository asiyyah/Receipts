import { useState } from 'react'
import { motion } from 'framer-motion'
import categories from '../data/categories'

export default function ExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      errs.amount = 'Enter a valid amount'
    }
    if (!category) {
      errs.category = 'Select a category'
    }
    if (!date) {
      errs.date = 'Pick a date'
    }
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    onAdd({
      id: Date.now().toString(),
      amount: Number(amount),
      category,
      date,
    })

    setAmount('')
    setCategory('')
    setDate(new Date().toISOString().split('T')[0])
    setErrors({})
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-calm-200 p-6"
    >
      <h2 className="text-lg font-semibold text-calm-900 mb-4">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-calm-600 mb-1.5">
            Amount (₦)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.amount ? 'border-red-300 bg-red-50' : 'border-calm-200'
            } focus:outline-none focus:ring-2 focus:ring-calm-300 focus:border-transparent transition-all text-calm-900 placeholder-calm-300`}
          />
          {errors.amount && (
            <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-calm-600 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.category ? 'border-red-300 bg-red-50' : 'border-calm-200'
            } focus:outline-none focus:ring-2 focus:ring-calm-300 focus:border-transparent transition-all text-calm-900 bg-white`}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-400 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-calm-600 mb-1.5">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.date ? 'border-red-300 bg-red-50' : 'border-calm-200'
            } focus:outline-none focus:ring-2 focus:ring-calm-300 focus:border-transparent transition-all text-calm-900`}
          />
          {errors.date && (
            <p className="text-red-400 text-xs mt-1">{errors.date}</p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="w-full py-2.5 bg-calm-700 hover:bg-calm-800 text-white font-medium rounded-xl transition-colors"
        >
          Add Expense
        </motion.button>
      </form>
    </motion.div>
  )
}
