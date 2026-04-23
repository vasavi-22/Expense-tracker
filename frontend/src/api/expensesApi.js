const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export async function fetchExpenses({ category, sortByDate }) {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (sortByDate) query.set("sort", "date");

  const response = await fetch(`${API_BASE}/expenses?${query.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to load expenses");
  }

  const data = await response.json();
  return data.expenses;
}

export async function createExpense(payload, idempotencyKey) {
  const response = await fetch(`${API_BASE}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to save expense");
  }

  return response.json();
}
