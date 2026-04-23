import { createExpense, listExpenses } from "../db.js";
import { validateCreateExpensePayload } from "../validation.js";

export function createExpenseFromRequest(body, idempotencyKey) {
  const validation = validateCreateExpensePayload(body);
  if (!validation.ok) {
    return {
      status: 400,
      body: { error: validation.error },
    };
  }

  const expense = createExpense({
    ...validation.data,
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
