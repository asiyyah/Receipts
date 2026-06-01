# Software Engineering Principles

## 1. Single Responsibility Principle (SRP)

**In plain words:** Each file or component should have exactly one job — one reason to change.

| File | Responsibility | Lines |
|---|---|---|
| `ExpenseForm.jsx` | Handles the "Add Expense" form — input fields, validation, and submission | all |
| `ExpenseList.jsx` | Renders the list of transactions with animations | all |
| `CategoryChart.jsx` | Renders the spending-by-category donut chart | all |
| `SpendingBarChart.jsx` | Renders the daily-spending bar chart | all |
| `FilterTabs.jsx` | Renders and switches between filter tabs | all |
| `SummaryCard.jsx` | Displays the total-spent summary card | all |
| `calculations.js` | Pure math/formatting functions (`calculateTotal`, `groupByCategory`, `dailyTotals`, `formatCurrency`) | all |
| `dateHelpers.js` | Pure date manipulation functions (`getWeekId`, `getDayLabel`, `formatDate`, `isInWeek`) | all |
| `storage.js` | Reads/writes expenses from `localStorage` | all |
| `categories.js` | Exports the static categories config (id, label, color, emoji) | all |

---

## 2. Separation of Concerns

**In plain words:** Different kinds of logic (UI, data, calculations, persistence) live in different directories and files — no file does more than one kind of work.

The folder structure enforces this:

```
src/
├── components/    # UI rendering only
├── utils/         # Pure business logic (calculations, dates, storage)
├── data/          # Static configuration data
└── App.jsx        # Orchestration (state management, wiring)
```

### Components never touch localStorage directly

`ExpenseList.jsx`, `CategoryChart.jsx`, etc. receive data as props and have no idea about storage.

**`CategoryChart.jsx:6`**
```js
export default function CategoryChart({ expenses }) {
```

**`ExpenseList.jsx:6`**
```js
export default function ExpenseList({ expenses, onDelete }) {
```

### Components never calculate totals themselves

They import pure utility functions from `utils/`.

**`SummaryCard.jsx:5`**
```js
const total = calculateTotal(expenses)
```

**`CategoryChart.jsx:7`**
```js
const grouped = groupByCategory(expenses)
```

### Components never know about date filtering

The `filterExpenses` function lives in `App.jsx` and passes already-filtered data down.

**`App.jsx:31-35`**
```js
function filterExpenses(expenses, filterId) {
  if (filterId === 'all-time') return expenses
  const weekId = filterId === 'this-week' ? getCurrentWeekId() : getLastWeekId()
  return expenses.filter((e) => isInWeek(e.date, weekId))
}
```

---

## 3. Composition

**In plain words:** Complex UIs are built by nesting small, focused components together rather than having one giant component.

`App.jsx` composes six child components into a complete layout:

**`App.jsx:84`** — FilterTabs inside the header
```jsx
<FilterTabs active={filter} onChange={setFilter} />
```

**`App.jsx:88`** — SummaryCard inside the header
```jsx
<SummaryCard expenses={filtered} />
```

**`App.jsx:94`** — ExpenseForm in the sidebar
```jsx
<ExpenseForm onAdd={addExpense} />
```

**`App.jsx:99-100`** — Two charts side by side
```jsx
<CategoryChart expenses={filtered} />
<SpendingBarChart expenses={filtered} />
```

**`App.jsx:106`** — ExpenseList in a full-width section
```jsx
<ExpenseList expenses={filtered} onDelete={deleteExpense} />
```

Recharts uses composition too — `<PieChart>` contains `<Pie>`, `<Cell>`, `<Tooltip>`, `<Legend>`:

**`CategoryChart.jsx:36-68`**
```jsx
<PieChart>
  <Pie ...>
    {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
  </Pie>
  <Tooltip ... />
  <Legend ... />
</PieChart>
```

---

## 4. Immutability

**In plain words:** Never modify existing data directly — always create a new copy with the changes applied.

### Adding an expense (new array via spread)

**`App.jsx:58-60`**
```js
const addExpense = useCallback((expense) => {
  setExpenses((prev) => [...prev, expense])
}, [])
```

### Deleting an expense (new array via filter)

**`App.jsx:62-64`**
```js
const deleteExpense = useCallback((id) => {
  setExpenses((prev) => prev.filter((e) => e.id !== id))
}, [])
```

### Sorting without mutating the original prop

**`ExpenseList.jsx:18`**
```js
const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
```

### Sample data uses spread to avoid mutation

**`App.jsx:23-29`**
```js
].map((e) => {
  const today = new Date()
  const dayOffset = Math.floor(Math.random() * 7)
  const d = new Date(today)
  d.setDate(d.getDate() - dayOffset)
  return { ...e, date: d.toISOString().split('T')[0] }
})
```

---

## 5. Pure Functions

**In plain words:** A function that always returns the same result for the same inputs and has no side effects (doesn't change anything outside itself).

### All utility functions in `calculations.js` are pure

**`calculations.js:1-3`**
```js
export function calculateTotal(expenses) {
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0)
}
```

**`calculations.js:5-14`**
```js
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
```

**`calculations.js:16-24`**
```js
export function dailyTotals(expenses, days) {
  return days.map((day) => {
    const dayExpenses = expenses.filter((e) => e.date === day)
    return { date: day, total: dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0) }
  })
}
```

**`calculations.js:26-31`**
```js
export function formatCurrency(amount) {
  return `₦${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  })}`
}
```

### Most `dateHelpers.js` functions are pure

**`dateHelpers.js:1-7`** — `getWeekId`
**`dateHelpers.js:19-23`** — `getDayLabel`
**`dateHelpers.js:35-42`** — `formatDate`
**`dateHelpers.js:44-46`** — `isInWeek`

---

## 6. Unidirectional Data Flow

**In plain words:** Data flows down the component tree via props, and events flow up via callbacks. There is no two-way binding between parent and child.

State lives only in `App.jsx` and is passed down:

**`App.jsx:38-39`** — All state is declared at the top level
```js
const [expenses, setExpenses] = useState([])
const [filter, setFilter] = useState('this-week')
```

Data flows **down** via props:
- `expenses={filtered}` → `SummaryCard`, `CategoryChart`, `SpendingBarChart`, `ExpenseList`
- `active={filter}` → `FilterTabs`

Events flow **up** via callbacks:
- `onAdd={addExpense}` — `ExpenseForm` calls this with the new expense
- `onDelete={deleteExpense}` — `ExpenseList` calls this with the expense id to remove
- `onChange={setFilter}` — `FilterTabs` calls this with the new filter id

Children never mutate parent state directly — they call a callback and let the parent handle the mutation.

---

## 7. Encapsulation

**In plain words:** Hide internal details; only expose what other code needs.

### Module-scoped constant in `storage.js`

**`storage.js:1`**
```js
const STORAGE_KEY = 'receipts_expenses'
```
This key is not exported — no other file can access or change it. Only `loadExpenses` and `saveExpenses` use it.

### Each component hides its own internal state

**`ExpenseForm.jsx:6-9`**
```js
const [amount, setAmount] = useState('')
const [category, setCategory] = useState('')
const [date, setDate] = useState(new Date().toISOString().split('T')[0])
const [errors, setErrors] = useState({})
```
The parent (`App.jsx`) has no idea about these form-local states. The `validate` function inside `ExpenseForm.jsx:11-23` is also private to that component.

---

## 8. Declarative Programming

**In plain words:** You describe *what* the UI should look like for a given state, not *how* to build it step-by-step.

Every React component is declarative — JSX describes the desired output for the given props/state:

**`FilterTabs.jsx:10-33`** — The entire tab bar is a description of what to render based on `active`
```jsx
return (
  <div className="bg-white ...">
    {filters.map((f) => (
      <button key={f.id} onClick={() => onChange(f.id)} className={...}>
        {active === f.id && <motion.div layoutId="filter-bg" ... />}
        <span className="relative z-10">{f.label}</span>
      </button>
    ))}
  </div>
)
```

**`ExpenseList.jsx:7-16`** — Early return for the empty state
```jsx
if (expenses.length === 0) {
  return (
    <div className="bg-white rounded-2xl ...">
      <h2>Recent Transactions</h2>
      <div className="...">No transactions yet</div>
    </div>
  )
}
```

**`CategoryChart.jsx:16-25`** — Empty state rendered declaratively
```jsx
if (data.length === 0) {
  return (
    <div className="bg-white ...">
      <h2>Spending by Category</h2>
      <div>No data for this period</div>
    </div>
  )
}
```

---

## 9. Don't Repeat Yourself (DRY)

**In plain words:** Define a piece of information or logic in only one place, then reference it everywhere else.

### Categories defined once, used everywhere

**`data/categories.js:1-7`** — Single source of truth
```js
const categories = [
  { id: 'food', label: 'Food', color: '#A78BFA', emoji: '🍽️' },
  { id: 'transport', label: 'Transport', color: '#67E8F9', emoji: '🚌' },
  { id: 'data', label: 'Data', color: '#FCD34D', emoji: '📱' },
  { id: 'fun', label: 'Fun', color: '#FCA5A5', emoji: '🎉' },
  { id: 'other', label: 'Other', color: '#A7F3D0', emoji: '📦' },
]
```

Reused by:
- **`ExpenseForm.jsx:3`** — populates the `<select>` dropdown
- **`ExpenseList.jsx:2,26`** — looks up the emoji and label for each expense
- **`CategoryChart.jsx:3,8-14`** — provides colors and labels for the pie chart

### `formatCurrency` defined once, used in three places

**`calculations.js:26-31`** — Defined once
**`SummaryCard.jsx:2,17`** — Used for the total display
**`ExpenseList.jsx:4,47`** — Used for each row amount
**`SpendingBarChart.jsx:12,54`** — Used in the chart tooltip

---

## 10. Defensive Programming (Fail-Safe)

**In plain words:** Expect that things can go wrong (missing data, storage failures) and handle it gracefully instead of crashing.

### `storage.js` handles `localStorage` failures

**`storage.js:3-13`**
```js
export function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) { return JSON.parse(data) }
  } catch (e) {
    console.warn('Failed to load expenses from localStorage', e)
  }
  return null
}
```

**`storage.js:15-21`**
```js
export function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  } catch (e) {
    console.warn('Failed to save expenses to localStorage', e)
  }
}
```

### `App.jsx` gracefully falls back to sample data

**`App.jsx:42-50`**
```js
useEffect(() => {
  const stored = loadExpenses()
  if (stored && stored.length > 0) {
    setExpenses(stored)
  } else {
    setExpenses(SAMPLE_DATA)
  }
  setLoaded(true)
}, [])
```

### Charts handle empty data gracefully

**`CategoryChart.jsx:16-25`** — Shows "No data for this period" instead of crashing
**`ExpenseList.jsx:7-16`** — Shows "No transactions yet" instead of an empty list

### ExpenseForm validates before submitting

**`ExpenseForm.jsx:11-23,27-29`**
```js
function validate() {
  const errs = {}
  if (!amount || isNaN(amount) || Number(amount) <= 0) errs.amount = 'Enter a valid amount'
  if (!category) errs.category = 'Select a category'
  if (!date) errs.date = 'Pick a date'
  return errs
}
// ...
const errs = validate()
setErrors(errs)
if (Object.keys(errs).length > 0) return
```

---

## Summary Table

| Principle | Where to look |
|---|---|
| Single Responsibility | Each component file does exactly one thing |
| Separation of Concerns | `components/`, `utils/`, `data/` directories |
| Composition | `App.jsx:76-113` — six components composed into layout |
| Immutability | `App.jsx:59` (spread), `App.jsx:63` (filter), `ExpenseList.jsx:18` (copy) |
| Pure Functions | `calculations.js` all functions, `dateHelpers.js` most functions |
| Unidirectional Data Flow | State in `App.jsx`, props down, callbacks up |
| Encapsulation | `storage.js:1` (private key), `ExpenseForm.jsx:6-9` (local form state) |
| Declarative Programming | All JSX components describe UI for given state/props |
| DRY | `categories.js` single source of truth, `formatCurrency` shared utility |
| Defensive Programming | `storage.js` try/catch, `App.jsx` sample data fallback, chart empty states |
