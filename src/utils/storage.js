const STORAGE_KEY = "receipts_expenses";

function isValidExpense(expense) {
  return (
    expense &&
    typeof expense.id === "string" &&
    typeof expense.category === "string" &&
    typeof expense.date === "string" &&
    Number.isFinite(Number(expense.amount))
  );
}

function sanitizeExpenses(expenses) {
  if (!Array.isArray(expenses)) return [];
  return expenses.filter(isValidExpense);
}

export function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.every(isValidExpense)) {
        return parsed;
      }
      console.warn("Invalid expense data found in localStorage");
    }
  } catch (e) {
    console.warn("Failed to load expenses from localStorage", e);
  }
  return null;
}

export function saveExpenses(expenses) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(sanitizeExpenses(expenses)),
    );
  } catch (e) {
    console.warn("Failed to save expenses to localStorage", e);
  }
}
