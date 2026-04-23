import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.resolve(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "expenses.json");

function getInitialStore() {
  return {
    expenses: [],
    idempotency: {},
  };
}

function readStore() {
  if (!fs.existsSync(dbPath)) {
    return getInitialStore();
  }

  try {
    const raw = fs.readFileSync(dbPath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      idempotency: parsed.idempotency && typeof parsed.idempotency === "object" ? parsed.idempotency : {},
    };
  } catch {
    return getInitialStore();
  }
}

function writeStore(store) {
  fs.writeFileSync(dbPath, JSON.stringify(store, null, 2), "utf8");
}

export function toApiExpense(row) {
  return {
    id: row.id,
    amount: Number((row.amount_cents / 100).toFixed(2)),
    category: row.category,
    description: row.description,
    date: row.date,
    created_at: row.created_at,
  };
}

function makeExpenseId() {
  return crypto.randomUUID();
}

export function createExpense({ amount, category, description, date, idempotencyKey }) {
  const store = readStore();
  const amountCents = Math.round(amount * 100);
  const now = new Date().toISOString();

  const existingExpenseId = idempotencyKey ? store.idempotency[idempotencyKey] : undefined;
  if (existingExpenseId) {
    const existingExpense = store.expenses.find((expense) => expense.id === existingExpenseId);
    if (existingExpense) return toApiExpense(existingExpense);
  }

  const row = {
    id: makeExpenseId(),
    amount_cents: amountCents,
    category: category.trim(),
    description: description.trim(),
    date,
    created_at: now,
  };

  store.expenses.push(row);
  if (idempotencyKey) {
    store.idempotency[idempotencyKey] = row.id;
  }
  writeStore(store);
  return toApiExpense(row);
}

export function listExpenses({ category, sort }) {
  const store = readStore();
  let rows = store.expenses.slice();

  if (category) {
    rows = rows.filter((row) => row.category === category);
  }

  if (sort === "date") {
    rows.sort((a, b) => {
      if (a.date === b.date) return b.created_at.localeCompare(a.created_at);
      return b.date.localeCompare(a.date);
    });
  } else {
    rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  return rows.map(toApiExpense);
}

export function clearAllData() {
  writeStore(getInitialStore());
}
