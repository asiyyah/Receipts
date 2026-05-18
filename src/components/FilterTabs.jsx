import { motion } from 'framer-motion'

const filters = [
  { id: 'this-week', label: 'This Week' },
  { id: 'last-week', label: 'Last Week' },
  { id: 'all-time', label: 'All Time' },
]

export default function FilterTabs({ active, onChange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-calm-200 p-1 inline-flex gap-1">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            active === f.id
              ? 'text-white'
              : 'text-calm-500 hover:text-calm-700'
          }`}
        >
          {active === f.id && (
            <motion.div
              layoutId="filter-bg"
              className="absolute inset-0 bg-calm-700 rounded-lg"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{f.label}</span>
        </button>
      ))}
    </div>
  )
}
