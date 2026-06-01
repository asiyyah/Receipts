# Codebase Audit: Vulnerabilities, Performance, Accessibility, and Engineering Practices

This audit explains the issues I found in the project, why they matter, and how to fix them. It is written in a teaching tone so you can understand the tradeoffs and learn from the app.

---

## 1. Security / vulnerability notes

### 1.1 `localStorage` data is trusted without validation

- Code location: `src/utils/storage.js`, `src/App.jsx`
- What happens: The app reads saved expenses from `localStorage` and assumes the value is a valid array of expenses.
- Why it matters: If a browser extension or someone manually changes the saved data, the app could receive unexpected values that may break the UI.
- Suggested fix:
  - Validate the parsed value before using it.
  - Return `null` or an empty array if the saved data is malformed.
- Why this fix works: It keeps the app from trusting arbitrary strings in local storage and prevents runtime errors from broken or tampered data.

Example fix in `loadExpenses`:

```js
export function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    console.warn("Failed to load expenses from localStorage", e);
    return null;
  }
}
```

### 1.2 Dependency audit not present

- Code location: `package.json`
- What happens: The project does not show evidence of a dependency vulnerability check.
- Why it matters: Libraries like `vite`, `react`, `framer-motion`, and `recharts` can have security issues in old versions.
- Suggested fix:
  - Run `npm audit` regularly.
  - Update dependencies to safe versions.
- Why this fix works: It catches known package vulnerabilities before they reach production and keeps the app safer.

---

## 2. Performance traps

### 2.1 Unused derived value in `App.jsx`

- Code location: `src/App.jsx`
- What happens: `const filteredTotal = calculateTotal(filtered)` is calculated but never used.
- Why it matters: This is wasted work and makes the code harder to read.
- Suggested fix: Remove the unused variable or use it in the UI if it was intended to show a number.
- Why this fix works: It simplifies the component and removes unnecessary computation.

### 2.2 List sorting and chart data are recomputed every render

- Code location: `src/components/ExpenseList.jsx`, `src/components/CategoryChart.jsx`, `src/components/SpendingBarChart.jsx`
- What happens: The expense list is sorted and chart data are re-created on every render.
- Why it matters: For a small app this is fine, but as the data grows it can become slow.
- Suggested fix:
  - Use `useMemo` for the sorted expense list and computed chart data.
  - Keep the expensive work tied to input changes only.
- Why this fix works: It prevents repeated calculations when the input props have not changed.

Example fix in `ExpenseList.jsx`:

```js
import { useMemo } from "react";

const sorted = useMemo(
  () => [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)),
  [expenses],
);
```

### 2.3 Sample data logic is misleading

- Code location: `src/App.jsx`
- What happens: `SAMPLE_DATA` is defined with `getCurrentWeekId()` and `getLastWeekId()`, but then the dates are replaced with random dates from the last 7 days.
- Why it matters: The sample data can end up in the wrong week and the UI may show inconsistent examples.
- Suggested fix: Keep sample dates deterministic or use the week helpers consistently.
- Why this fix works: It makes demo data predictable and avoids confusing week filters.

Example fix:

```js
const SAMPLE_DATA = [
  { id: '1', amount: 8500, category: 'food', date: getCurrentWeekId() },
  ...
]
```

---

## 3. Accessibility misses

### 3.1 Form labels are not properly associated with inputs

- Code location: `src/components/ExpenseForm.jsx`
- What happens: `<label>` elements are not connected to the corresponding `<input>` or `<select>` elements.
- Why it matters: Screen readers and users who click the label expect the correct input to receive focus.
- Suggested fix: Add `id` to inputs and `htmlFor` to labels, or wrap the input inside the label.
- Why this fix works: It creates a proper label-input relationship that assistive technology relies on.

Example fix:

```jsx
<label htmlFor="amount" className="...">Amount (₦)</label>
<input id="amount" type="number" ... />
```

### 3.2 Delete button has no accessible label

- Code location: `src/components/ExpenseList.jsx`
- What happens: The remove button only contains the symbol `✕`.
- Why it matters: Screen reader users cannot know what that button does.
- Suggested fix: Add `aria-label="Delete expense"` to the button.
- Why this fix works: It gives screen readers the meaning of the icon-only button.

Example fix:

```jsx
<button
  aria-label="Delete expense"
  onClick={() => onDelete(expense.id)}
  ...
>
  ✕
</button>
```

### 3.3 Filter tabs miss accessible tab semantics

- Code location: `src/components/FilterTabs.jsx`
- What happens: The buttons do not expose their current state with `aria-pressed` or a tablist role.
- Why it matters: Keyboard and screen reader users need clear state so they know which filter is active.
- Suggested fix:
  - Add `aria-pressed={active === f.id}` to each button.
  - Optionally wrap the group in `role="tablist"` and give each button `role="tab"`.
- Why this fix works: It communicates active state to assistive technology.

Example fix:

```jsx
<button
  onClick={() => onChange(f.id)}
  aria-pressed={active === f.id}
  className={...}
>
```

````

### 3.4 Chart tooltips and legends rely on hover

- Code location: `src/components/CategoryChart.jsx`, `src/components/SpendingBarChart.jsx`
- What happens: The charts rely on hover interactions for details.
- Why it matters: Keyboard-only users and some touch devices cannot access hover-only controls.
- Suggested fix:
  - Add visible summaries or captions alongside the charts.
  - Ensure keyboard focus can reach chart elements if possible.
- Why this fix works: It improves accessibility for users who cannot hover with a mouse.

---

## 4. Software engineering issues

### 4.1 Missing error handling on `onAdd` data shape

- Code location: `src/components/ExpenseForm.jsx`
- What happens: The form creates an expense object and sends it to `onAdd` without explicit shape validation.
- Why it matters: A future change to the parent component could accept a different shape, causing subtle bugs.
- Suggested fix: Normalize and document the expected expense shape in one place, or add a shared type/interface.
- Why this fix works: It keeps the contract between components clear and protects against accidental mismatches.

### 4.2 `useCallback` is used for `addExpense` and `deleteExpense` without clear need

- Code location: `src/App.jsx`
- What happens: `useCallback` is used even though the functions do not depend on props, and the app is small.
- Why it matters: Premature optimization adds complexity without meaningful benefit.
- Suggested fix: Remove `useCallback` unless you actually need stable identity for a child dependency.
- Why this fix works: It simplifies the code and avoids the cognitive overhead of hooks that are not required.

### 4.3 No prop-type or static type checking

- Code location: entire component tree
- What happens: The app does not use TypeScript or runtime prop validation.
- Why it matters: Mistyped props or wrong shapes can cause runtime bugs that are harder to debug.
- Suggested fix: Add TypeScript or a lightweight prop validation layer.
- Why this fix works: It catches mistakes earlier and makes component contracts explicit.

### 4.4 Inline click handlers and anonymous functions inside render

- Code location: `src/components/ExpenseForm.jsx`, `src/components/ExpenseList.jsx`, `src/components/FilterTabs.jsx`
- What happens: The app creates new functions inside render for every button.
- Why it matters: In a large app, this can cause unnecessary re-renders and reduce performance.
- Suggested fix: Move handlers out of JSX or use `useCallback` when the component is expensive.
- Why this fix works: It creates stable functions and reduces render noise.

Example from `ExpenseList.jsx`:
```jsx
const handleDelete = (id) => () => onDelete(id)
<button onClick={handleDelete(expense.id)} ...>
````

### 4.5 Styling class names are repeated

- Code location: many components
- What happens: Tailwind classes are repeated in multiple places.
- Why it matters: Repetition makes maintenance harder.
- Suggested fix: Extract shared class strings into constants or component wrappers.
- Why this fix works: It reduces duplication and keeps styling consistent.

---

## 5. Recommendations for improvement

1. Add an accessibility audit step: use `eslint-plugin-jsx-a11y` and run it during lint.
2. Add a performance lint or memoization review for derived state in larger data sets.
3. Replace the sample data generation logic with deterministic demo values.
4. Add basic shape validation for expenses in `storage.js` or use TypeScript.
5. Remove unused variables like `filteredTotal`.

---

## 6. Summary of the most important fixes

- Fix accessibility by associating labels and adding `aria-label` for icon buttons.
- Remove `filteredTotal` because it is never used.
- Validate `localStorage` data so bad saved JSON does not break the app.
- Simplify `useCallback` usage and avoid premature optimization.
- Make demo data deterministic to avoid misleading filter behavior.

These changes make the app more robust, easier to maintain, and more friendly for people who use assistive technology.
