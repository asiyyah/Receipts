export function calculateTotal(expenses) {
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0)
}

export function groupByCategory(expenses) {
  const groups = {}
  expenses.forEach((e) => {
    if (!groups[e.category]) {
      groups[e.category] = 0
    }
    groups[e.category] += Number(e.amount)
  })
  return groups
}

export function dailyTotals(expenses, days) {
  return days.map((day) => {
    const dayExpenses = expenses.filter((e) => e.date === day)
    return {
      date: day,
      total: dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    }
  })
}

export function formatCurrency(amount) {
  return `₦${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}
