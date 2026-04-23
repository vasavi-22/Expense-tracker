import { useEffect, useMemo, useRef, useState } from "react";
import { createExpense, fetchExpenses } from "./api/expensesApi";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseControls from "./components/ExpenseControls";
import ExpenseSummary from "./components/ExpenseSummary";
import ExpenseTable from "./components/ExpenseTable";
import { calculateTotal, summarizeByCategory } from "./utils";

const defaultForm = {
  amount: "",
  category: "",
  description: "",
  date: "",
};

function makeIdempotencyKey() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function App() {
  const [form, setForm] = useState(() => {
    const saved = window.localStorage.getItem("expense-form-draft");
    if (!saved) return defaultForm;
    try {
      return { ...defaultForm, ...JSON.parse(saved) };
    } catch {
      return defaultForm;
    }
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortByDate, setSortByDate] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const idempotencyKeyRef = useRef(makeIdempotencyKey());

  useEffect(() => {
    window.localStorage.setItem("expense-form-draft", JSON.stringify(form));
  }, [form]);

  async function loadExpenses() {
    setLoading(true);
    setError("");
    try {
      const items = await fetchExpenses({ category: selectedCategory, sortByDate });
      setExpenses(items);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Fetching in effect is intentional for filter/sort changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortByDate]);

  const total = useMemo(() => calculateTotal(expenses), [expenses]);
  const summary = useMemo(() => summarizeByCategory(expenses), [expenses]);

  function onFieldChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    idempotencyKeyRef.current = makeIdempotencyKey();
  }

  async function onSubmit(event) {
    event.preventDefault();
    setFormError("");
    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount < 0) {
      setFormError("Amount must be a non-negative number.");
      return;
    }
    if (!form.date) {
      setFormError("Date is required.");
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    setError("");
    try {
      await createExpense(
        {
          amount,
          category: form.category,
          description: form.description,
          date: form.date,
        },
        idempotencyKeyRef.current,
      );

      setForm(defaultForm);
      idempotencyKeyRef.current = makeIdempotencyKey();
      await loadExpenses();
    } catch (submitError) {
      setError(submitError.message || "Failed to save expense.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page">
      <h1>Expense Tracker</h1>

      <AddExpenseForm
        form={form}
        formError={formError}
        submitting={submitting}
        onFieldChange={onFieldChange}
        onSubmit={onSubmit}
      />

      <section className="card">
        <h2>Expenses</h2>
        <ExpenseControls
          selectedCategory={selectedCategory}
          sortByDate={sortByDate}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortByDate}
        />

        {error && <p className="error">{error}</p>}
        {!error && loading && <p>Loading expenses...</p>}
        <ExpenseTable expenses={expenses} />
        <ExpenseSummary total={total} summary={summary} />
      </section>
    </main>
  );
}

export default App;
