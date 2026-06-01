# Cross-Check: What the First Audit Missed

A second pass over the same codebase found issues the initial audit overlooked. Each finding includes the category from the first audit that should have caught it.

---

## 1. `key={index}` in CategoryChart `Cell` (Engineering Practices)

- **Code location:** `src/components/CategoryChart.jsx:49`
- **What happens:** The `Cell` elements inside the Recharts `Pie` use `key={index}`. The `data` array is rebuilt on every render (no `useMemo`), so React may reuse or misplace animated elements when data changes.
- **Why the first audit should have caught it:** Section 4 covered inline handlers and missing `useMemo`, but missed this identical pattern in chart data.
- **Suggested fix:** Use a stable key from the data, e.g. `entry.name`, or memoize the `data` computation.

## 2. `Date.now().toString()` ID collision (Engineering Practices)

- **Code location:** `src/components/ExpenseForm.jsx:32`
- **What happens:** Each new expense gets `id: Date.now().toString()`. If two expenses are submitted in the same millisecond (or a script adds them programmatically), the IDs collide. React uses these as keys, so duplicates cause rendering bugs.
- **Why the first audit should have caught it:** Section 4.1 flagged missing shape validation but didn't examine identity generation.
- **Suggested fix:** Use `crypto.randomUUID()` or a counter. `crypto.randomUUID()` is available in all modern browsers and is collision-free.

## 3. `formatCurrency` uses en-US locale for Nigerian Naira (Engineering Practices)

- **Code location:** `src/utils/calculations.js:27`
- **What happens:** The function formats with `toLocaleString('en-US')` but uses `₦` as the symbol. The locale and currency are mismatched — large numbers get US-style formatting (commas every three digits) which is correct for Nigeria too, but more importantly the function name implies currency formatting while the locale choice is inconsistent with the symbol.
- **Why the first audit should have caught it:** Section 4 covered inconsistencies and repeated patterns but missed this locale-symbol mismatch.
- **Suggested fix:** Use `toLocaleString('en-NG')`, or accept a locale parameter.

## 4. Delete button invisible on touch devices (Accessibility)

- **Code location:** `src/components/ExpenseList.jsx:51`
- **What happens:** The delete button uses `opacity-0 group-hover:opacity-100`. On touch devices there is no hover state, so the button is permanently invisible. Users who can hover see it; users who can't don't.
- **Why the first audit should have caught it:** Section 3.2 flagged the missing `aria-label` on this same button but missed the visibility problem.
- **Suggested fix:** Keep the button always visible (with reduced opacity) on mobile, or replace the hover pattern with a swipe-to-delete gesture.

## 5. Silent failure on localStorage quota exceeded (Security / Resilience)

- **Code location:** `src/utils/storage.js:17-20`
- **What happens:** `saveExpenses` wraps `setItem` in a `try/catch` and only logs a warning. When `localStorage` is full, the user's data is silently dropped. They have no way of knowing their expense was not saved.
- **Why the first audit should have caught it:** Section 1.1 flagged reading from localStorage without validation but did not examine the write path.
- **Suggested fix:** Surface the error to the user — show a toast or inline message when saving fails.

## 6. Unused `@types/react` and `@types/react-dom` devDependencies (Engineering Practices)

- **Code location:** `package.json:20-21`
- **What happens:** The project installs `@types/react` and `@types/react-dom` but uses only `.jsx` files with no TypeScript. These packages add install time, bundle-lock noise, and occasional false-positive type warnings in editors.
- **Why the first audit should have caught it:** Section 4.3 noted the lack of TypeScript but did not flag the unused type packages already present.
- **Suggested fix:** Remove both from `devDependencies`.

## 7. No error boundary (Engineering Practices)

- **Code location:** entire component tree (`src/App.jsx`)
- **What happens:** If any child component throws during render (e.g. a Recharts error, a malformed expense), the entire app unmounts and shows a white screen. There is no fallback UI.
- **Why the first audit should have caught it:** Section 4.1 flagged error handling on the `onAdd` path but did not consider render-time error containment.
- **Suggested fix:** Add a React error boundary (class component with `componentDidCatch` or a library wrapper) around the main content area.

## 8. No loading-state distinction (Performance/UX)

- **Code location:** `src/App.jsx:38-49`
- **What happens:** A `loaded` boolean is set after the `useEffect` runs, but it is never used in the render. During the first render (before the effect fires), expenses is `[]` and the UI shows empty states. After the effect populates data, the UI jumps to full content. There is no loading indicator.
- **Why the first audit should have caught it:** Section 2 covered the `useEffect` and loaded state but did not question why `loaded` is tracked yet never rendered.
- **Suggested fix:** Show a skeleton or spinner while `loaded` is `false`, or remove the unused state.

## 9. No focus management after delete (Accessibility)

- **Code location:** `src/components/ExpenseList.jsx:49-54`
- **What happens:** When `AnimatePresence` removes an expense, focus is lost and returns to the document body. Keyboard or screen reader users are disoriented — they don't know where focus landed.
- **Why the first audit should have caught it:** Section 3 flagged keyboard/screen-reader issues (labels, aria-pressed, hover-only tooltips) but did not consider focus management after list mutations.
- **Suggested fix:** Move focus to the previous item, the next item, or the "Recent Transactions" heading after deletion.

## 10. No per-item shape validation on loaded data (Security)

- **Code location:** `src/utils/storage.js:6-8`
- **What happens:** `loadExpenses` checks that the parsed value is truthy but does not validate individual expense items. If a single item is missing `id`, `amount`, `category`, or `date`, downstream code (`calculateTotal`, `formatDate`, `categories.find`) may produce NaN, crash, or show garbled UI.
- **Why the first audit should have caught it:** Section 1.1 correctly flagged the outer-array validation gap but did not extend the reasoning to individual items.
- **Suggested fix:** After confirming the loaded value is an array, filter or map it to ensure each item has the required fields, dropping malformed entries.
