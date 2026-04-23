import { useEffect, useMemo, useRef, useState } from "react";
import { createExpense, fetchExpenses } from "./api/expensesApi";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseControls from "./components/ExpenseControls";
import ExpenseTable from "./components/ExpenseTable";
import { calculateTotal } from "./utils";

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
  const idempotencyKeyRef = useRef(makeIdempotencyKey());

  useEffect(() => {
    window.localStorage.setItem("expense-form-draft", JSON.stringify(form));
  }, [form]);

  async function loadExpenses() {
    const items = await fetchExpenses({ category: selectedCategory, sortByDate });
    setExpenses(items);
  }

  useEffect(() => {
    // Fetching in effect is intentional for filter/sort changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortByDate]);

  const total = useMemo(() => calculateTotal(expenses), [expenses]);

  function onFieldChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    idempotencyKeyRef.current = makeIdempotencyKey();
  }

  async function onSubmit(event) {
    event.preventDefault();
    const amount = Number(form.amount);

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
  }

  return (
    <main className="page">
      <h1>Expense Tracker</h1>

      <AddExpenseForm
        form={form}
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
          onRefresh={loadExpenses}
        />

        <ExpenseTable expenses={expenses} />
        <p className="total">Total: Rs {total.toFixed(2)}</p>
      </section>
    </main>
  );
}

export default App;
