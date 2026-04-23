import { createExpense, listExpenses } from "../db.js";

export function createExpenseFromRequest(body, idempotencyKey) {
  const expense = createExpense({
    amount: Number(body.amount),
    category: String(body.category ?? ""),
    description: String(body.description ?? ""),
    date: String(body.date ?? ""),
    idempotencyKey,
  });
  return { status: 201, body: expense };
}

export function getExpensesFromQuery(query) {
  const { category, sort } = query;
  const expenses = listExpenses({
    category: typeof category === "string" ? category : undefined,
    sort: sort === "date" ? "date" : undefined,
  });

  return { status: 200, body: { expenses } };
}
