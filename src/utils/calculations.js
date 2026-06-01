const parseAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
};

export function calculateTotal(expenses) {
  return expenses.reduce((sum, e) => sum + parseAmount(e.amount), 0);
}

export function groupByCategory(expenses) {
  const groups = {};
  expenses.forEach((e) => {
    const category = typeof e.category === "string" ? e.category : "other";
    if (!groups[category]) {
      groups[category] = 0;
    }
    groups[category] += parseAmount(e.amount);
  });
  return groups;
}

export function dailyTotals(expenses, days) {
  return days.map((day) => {
    const dayExpenses = expenses.filter((e) => e.date === day);
    return {
      date: day,
      total: dayExpenses.reduce((sum, e) => sum + parseAmount(e.amount), 0),
    };
  });
}

export function formatCurrency(amount) {
  return `₦${parseAmount(amount).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
