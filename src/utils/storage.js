const STORAGE_KEY = 'receipts_expenses'

export function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (e) {
    console.warn('Failed to load expenses from localStorage', e)
  }
  return null
}

export function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  } catch (e) {
    console.warn('Failed to save expenses to localStorage', e)
  }
}
