import { useState, useEffect, useCallback, useMemo } from "react";
import { loadExpenses, saveExpenses } from "./utils/storage";
import { getCurrentWeekId, getLastWeekId, isInWeek } from "./utils/dateHelpers";
import ExpenseForm from "./components/ExpenseForm";
import SummaryCard from "./components/SummaryCard";
import CategoryChart from "./components/CategoryChart";
import SpendingBarChart from "./components/SpendingBarChart";
import FilterTabs from "./components/FilterTabs";
import ExpenseList from "./components/ExpenseList";

const SAMPLE_DATA = [
  { id: "1", amount: 8500, category: "food", date: getCurrentWeekId() },
  { id: "2", amount: 3200, category: "transport", date: getCurrentWeekId() },
  { id: "3", amount: 5000, category: "data", date: getCurrentWeekId() },
  { id: "4", amount: 12000, category: "fun", date: getCurrentWeekId() },
  { id: "5", amount: 2000, category: "other", date: getCurrentWeekId() },
  { id: "6", amount: 4500, category: "food", date: getLastWeekId() },
  { id: "7", amount: 1500, category: "transport", date: getLastWeekId() },
  { id: "8", amount: 3000, category: "data", date: getLastWeekId() },
  { id: "9", amount: 8000, category: "fun", date: getLastWeekId() },
  { id: "10", amount: 1000, category: "other", date: getLastWeekId() },
].map((e) => {
  const today = new Date();
  const dayOffset = Math.floor(Math.random() * 7);
  const d = new Date(today);
  d.setDate(d.getDate() - dayOffset);
  return { ...e, date: d.toISOString().split("T")[0] };
});

function filterExpenses(expenses, filterId) {
  if (filterId === "all-time") return expenses;
  const weekId =
    filterId === "this-week" ? getCurrentWeekId() : getLastWeekId();
  return expenses.filter((e) => isInWeek(e.date, weekId));
}

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const stored = loadExpenses();
    return stored && stored.length > 0 ? stored : SAMPLE_DATA;
  });
  const [filter, setFilter] = useState("this-week");

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  const addExpense = useCallback((expense) => {
    setExpenses((prev) => [...prev, expense]);
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const filtered = useMemo(
    () => filterExpenses(expenses, filter),
    [expenses, filter],
  );
  const filterLabel = useMemo(() => {
    if (filter === "this-week") return "This Week";
    if (filter === "last-week") return "Last Week";
    return "All Time";
  }, [filter]);

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-calm-900">Receipts</h1>
            <p className="text-calm-400 text-sm mt-1">{filterLabel}</p>
          </div>
          <FilterTabs active={filter} onChange={setFilter} />
        </div>

        <div className="mt-6">
          <SummaryCard expenses={filtered} />
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <ExpenseForm onAdd={addExpense} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CategoryChart expenses={filtered} />
            <SpendingBarChart expenses={filtered} />
          </div>
        </div>
      </main>

      <section className="mb-8">
        <ExpenseList expenses={filtered} onDelete={deleteExpense} />
      </section>

      <footer className="text-center text-calm-300 text-xs pb-8">
        Receipts &mdash; Track your spending with calm clarity.
      </footer>
    </div>
  );
}
