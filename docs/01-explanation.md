# Receipts App: Simple Code Explanation

This file explains every part of the project like a story for a 7-year-old. It shows what each file does, what each bit of code means, and how the app works.

---

## src/main.jsx

- `import { StrictMode } from 'react'`
  - This brings a special box that helps catch mistakes.
- `import { createRoot } from 'react-dom/client'`
  - This brings the thing that puts the app on the web page.
- `import './index.css'`
  - This brings the rules for how the page should look.
- `import App from './App.jsx'`
  - This brings the main app.
- `createRoot(document.getElementById('root')).render(...)`
  - This finds the empty space on the web page and fills it with the app.
- `<StrictMode><App /></StrictMode>`
  - This tells React to use the app and check for problems.

---

## src/App.jsx

- `import { useState, useEffect, useCallback } from 'react'`
  - `useState` holds changing values.
  - `useEffect` runs code when something changes.
  - `useCallback` remembers a function so it does not get remade too often.
- `import { loadExpenses, saveExpenses } from './utils/storage'`
  - These are helpers to read and write money data from the browser.
- `import { getCurrentWeekId, getLastWeekId, isInWeek } from './utils/dateHelpers'`
  - These helpers figure out which week a date belongs to.
- `import { calculateTotal, formatCurrency } from './utils/calculations'`
  - These helpers add numbers and make them look like money.
- `import ExpenseForm from './components/ExpenseForm'`
  - This brings the form where you add a new expense.
- `import SummaryCard from './components/SummaryCard'`
  - This brings the card that shows the total money spent.
- `import CategoryChart from './components/CategoryChart'`
  - This brings the pie chart for spending categories.
- `import SpendingBarChart from './components/SpendingBarChart'`
  - This brings the bar chart for daily spending.
- `import FilterTabs from './components/FilterTabs'`
  - This brings the buttons for choosing time filters.
- `import ExpenseList from './components/ExpenseList'`
  - This brings the list of recent expenses.

- `const SAMPLE_DATA = [...]`
  - This makes some pretend expense items so the app has something to show.
  - Each item has `id`, `amount`, `category`, and `date`.
  - The dates are changed so they look like recent days.

- `function filterExpenses(expenses, filterId)`
  - This looks at the chosen filter and keeps only the right expenses.
  - If the filter is `all-time`, it keeps everything.
  - If the filter is `this-week` or `last-week`, it keeps just that week.

- `export default function App()`
  - This starts the app and keeps track of its values.

- `const [expenses, setExpenses] = useState([])`
  - This keeps the list of expenses.
- `const [filter, setFilter] = useState('this-week')`
  - This keeps which time button is chosen.
- `const [loaded, setLoaded] = useState(false)`
  - This knows if the app has finished loading saved data.

- `useEffect(() => { ... }, [])`
  - This runs once when the app opens.
  - It tries to load saved expenses from the browser.
  - If there are saved expenses, it uses them.
  - If not, it uses the pretend sample data.
  - Then it says the app has loaded.

- `useEffect(() => { ... }, [expenses, loaded])`
  - This runs whenever expenses change after the app loaded.
  - It saves the current expenses to the browser.

- `const addExpense = useCallback((expense) => { ... }, [])`
  - This makes a new function to add an expense.
  - It adds the new item to the end of the list.

- `const deleteExpense = useCallback((id) => { ... }, [])`
  - This makes a function to remove an expense by its id.
  - It keeps all expenses except the one we want to delete.

- `const filtered = filterExpenses(expenses, filter)`
  - This finds the expenses that match the chosen filter.
- `const filteredTotal = calculateTotal(filtered)`
  - This adds up the filtered expenses.

- `const filterLabel = ...`
  - This decides the text shown at the top.
  - It shows `This Week`, `Last Week`, or `All Time`.

- `return (...)`
  - This returns the part of the app that the user sees.
  - It has a header with the title and filter buttons.
  - It has a summary card and the charts.
  - It has the expense form and the list of expenses.
  - It has a small footer at the bottom.

---

## src/components/ExpenseForm.jsx

- `import { useState } from 'react'`
  - This keeps track of what the user types into the form.
- `import { motion } from 'framer-motion'`
  - This makes the form animate smoothly.
- `import categories from '../data/categories'`
  - This gets the category options like food and transport.

- `export default function ExpenseForm({ onAdd })` 
  - This is the form component.
  - It gets `onAdd` from the parent app.
  - `onAdd` is the function to call when a new expense is ready.

- `const [amount, setAmount] = useState('')`
  - This stores the amount the user enters.
- `const [category, setCategory] = useState('')`
  - This stores the chosen category.
- `const [date, setDate] = useState(new Date().toISOString().split('T')[0])`
  - This stores the chosen date, starting with today.
- `const [errors, setErrors] = useState({})`
  - This stores any validation errors.

- `function validate()`
  - This checks if the user typed valid input.
  - It makes an object called `errs`.
  - If amount is missing or not a positive number, it sets `errs.amount`.
  - If category is empty, it sets `errs.category`.
  - If date is empty, it sets `errs.date`.
  - It returns the errors object.

- `function handleSubmit(e)`
  - This runs when the user clicks Add Expense.
  - `e.preventDefault()` stops the page from reloading.
  - It calls `validate()` to check the fields.
  - It saves the errors.
  - If there are errors, it stops.
  - If everything is good, it calls `onAdd(...)` with the new expense.
  - It then clears the form fields and errors.

- The `return (...)` block draws the form.
  - `motion.div` makes the whole box fade in and move up.
  - It shows a title `Add Expense`.
  - It shows an input for amount.
  - It shows a select box for category.
  - It shows a date input.
  - It shows a button that says `Add Expense`.
  - If there is an error for a field, it shows a red message.

- Input fields use `value` and `onChange`.
  - `onChange={(e) => setAmount(e.target.value)}` updates amount.
  - `onChange={(e) => setCategory(e.target.value)}` updates category.
  - `onChange={(e) => setDate(e.target.value)}` updates date.

---

## src/components/ExpenseList.jsx

- `import { motion, AnimatePresence } from 'framer-motion'`
  - This adds animation for the list items.
- `import categories from '../data/categories'`
  - This gets category names and icons.
- `import { formatDate } from '../utils/dateHelpers'`
  - This makes a date look nice.
- `import { formatCurrency } from '../utils/calculations'`
  - This makes the amount look like money.

- `export default function ExpenseList({ expenses, onDelete })`
  - This shows a list of expenses.
  - It gets `expenses` and `onDelete` from the parent.
  - `onDelete` is the function to remove one expense.

- `if (expenses.length === 0) { ... }`
  - If there are no expenses, it shows a friendly message.

- `const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))`
  - This makes a copy of the expenses and sorts them so newest comes first.

- `return (...)`
  - This draws the list box.
  - It shows a heading `Recent Transactions`.
  - It loops over each expense and draws a row.

- Inside the loop:
  - `const cat = categories.find((c) => c.id === expense.category)` finds the matching category.
  - `motion.div` makes each row animate.
  - It shows the category emoji and label.
  - It shows the formatted date and amount.
  - It shows a delete button with `onClick={() => onDelete(expense.id)}`.
  - When the button is clicked, it removes that expense.

---

## src/components/FilterTabs.jsx

- `import { motion } from 'framer-motion'`
  - This makes the active tab animate.

- `const filters = [...]`
  - This sets up the three tabs: This Week, Last Week, All Time.

- `export default function FilterTabs({ active, onChange })`
  - This draws the filter buttons.
  - It gets `active` to know which button is chosen.
  - It gets `onChange` to tell the parent when a button is clicked.

- `return (...)`
  - It draws a row of buttons.
  - Each button uses `onClick={() => onChange(f.id)}`.
  - If the button is the active one, it shows the colored background.
  - It uses `motion.div` to make one dot move smoothly between buttons.

---

## src/components/CategoryChart.jsx

- `import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'`
  - These pieces draw a pie chart.
- `import { motion } from 'framer-motion'`
  - This makes the chart fade in.
- `import categories from '../data/categories'`
  - These are the category colors and names.
- `import { groupByCategory } from '../utils/calculations'`
  - This helper adds amounts by category.

- `export default function CategoryChart({ expenses })`
  - This draws a circular chart of spending categories.

- `const grouped = groupByCategory(expenses)`
  - This adds up how much was spent in each category.

- `const data = categories.map(...)...filter(...)`
  - This makes the chart data.
  - It keeps only categories that have some money spent.

- `if (data.length === 0) { ... }`
  - If there is no spending, it shows `No data for this period`.

- `return (...)`
  - This draws the chart.
  - `ResponsiveContainer` makes it fit the box.
  - `Pie` draws the slices.
  - `Cell` colors each slice.
  - `Tooltip` shows the money when you hover.
  - `Legend` shows the category names at the bottom.

---

## src/components/SpendingBarChart.jsx

- `import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'`
  - These pieces draw the bar chart.
- `import { motion } from 'framer-motion'`
  - This makes the bar chart appear nicely.
- `import { getLast7Days, getDayLabel } from '../utils/dateHelpers'`
  - These helpers get the last 7 dates and day names.
- `import { dailyTotals, formatCurrency } from '../utils/calculations'`
  - These helpers add up daily spending and format the amount.

- `export default function SpendingBarChart({ expenses })`
  - This draws the daily spending chart.

- `const days = getLast7Days()`
  - This gets seven dates from today backwards.

- `const data = dailyTotals(expenses, days).map(...)`
  - This makes the data for each day.
  - It turns each day into a short label like `Mon`.

- `return (...)`
  - This draws the chart box.
  - `BarChart` shows bars for each day.
  - `CartesianGrid` adds light grid lines.
  - `XAxis` shows the day names.
  - `YAxis` shows the money numbers.
  - `Tooltip` shows the full date and amount when hovering.
  - `Bar` draws each bar.

---

## src/components/SummaryCard.jsx

- `import { motion } from 'framer-motion'`
  - This makes the card appear smoothly.
- `import { calculateTotal, formatCurrency } from '../utils/calculations'`
  - These helpers add up the money and make it look like currency.

- `export default function SummaryCard({ expenses })`
  - This shows the total spent amount.
  - It receives the expenses from the parent.

- `const total = calculateTotal(expenses)`
  - This adds all expense amounts together.

- `return (...)`
  - This draws a colorful card.
  - It shows the text `Total Spent`.
  - It shows the total amount in big letters.
  - It shows how many expenses there are.

---

## src/utils/calculations.js

- `export function calculateTotal(expenses)`
  - This function adds all the expense amounts.
  - It uses `reduce` to add each `e.amount`.

- `export function groupByCategory(expenses)`
  - This function groups expenses by their category.
  - It makes an object like `{ food: 500, transport: 200 }`.
  - It adds each amount into the right category bucket.

- `export function dailyTotals(expenses, days)`
  - This function makes one total for each day.
  - It looks at each date and adds amounts that match.
  - It returns a list of objects with `{ date, total }`.

- `export function formatCurrency(amount)`
  - This function turns a number into a money string like `₦1,200`.
  - It uses `toLocaleString` so the digits look nice.

---

## src/utils/dateHelpers.js

- `export function getWeekId(dateStr)`
  - This function finds the Monday of the week for a given date.
  - It makes a date in the middle of the day so the day is correct.
  - It moves back to Monday and returns that date as text.

- `export function getCurrentWeekId()`
  - This uses todays date and gets this weeks Monday.

- `export function getLastWeekId()`
  - This takes one week away from today and finds that Monday.

- `export function getDayLabel(dateStr)`
  - This turns a date into a short day name like `Mon`.

- `export function getLast7Days()`
  - This makes a list of the last seven dates, including today.

- `export function formatDate(dateStr)`
  - This turns a date into a friendly string like `Jun 1, 2026`.

- `export function isInWeek(dateStr, weekId)`
  - This checks if a date belongs inside the same week as `weekId`.

---

## src/utils/storage.js

- `const STORAGE_KEY = 'receipts_expenses'`
  - This is the name used to save data in the browser.

- `export function loadExpenses()`
  - This tries to read saved expenses from localStorage.
  - If the browser has saved data, it turns it back into a list.
  - If something breaks, it prints a warning and returns `null`.

- `export function saveExpenses(expenses)`
  - This tries to save the expense list into localStorage.
  - It turns the list into text using `JSON.stringify`.
  - If something breaks, it prints a warning.

---

## src/data/categories.js

- `const categories = [...]`
  - This file lists the categories the app uses.
  - Each category has an `id`, a `label`, a `color`, and an `emoji`.
  - Examples are food, transport, data, fun, and other.
- `export default categories`
  - This makes the category list available to other files.

---

## package.json (important project setup)

- `name`, `version`, `private`, and `type`
  - These describe the project.
- `scripts`
  - `dev`: starts the app in development mode using Vite.
  - `build`: prepares the app for production.
  - `lint`: checks code quality.
  - `preview`: shows the built app.
- `dependencies`
  - `react`, `react-dom`: the main library for the app.
  - `framer-motion`: makes smooth animations.
  - `recharts`: draws charts.
- `devDependencies`
  - `vite`: runs and builds the app.
  - `@vitejs/plugin-react`: connects React to Vite.
  - `tailwindcss` and `postcss`: style the app.
  - `eslint`: checks the code for mistakes.

---

## How the app works together

1. `main.jsx` starts the app and shows `App` on the page.
2. `App.jsx` keeps the list of expenses and the chosen filter.
3. The app loads saved expenses from the browser.
4. The app shows the form, the list, the summary, and the charts.
5. If you add a new expense, it appears in the list and saves.
6. If you click a filter, it changes which expenses are shown.
7. If you delete an expense, it disappears and the data saves again.

That is the whole app explained in a simple way. If you want, I can also make a shorter version with only the most important parts.
