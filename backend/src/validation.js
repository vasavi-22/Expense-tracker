function isValidIsoDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export function validateCreateExpensePayload(body) {
  const amount = Number(body?.amount);
  const category = String(body?.category ?? "").trim();
  const description = String(body?.description ?? "").trim();
  const date = String(body?.date ?? "").trim();

  if (!Number.isFinite(amount) || amount < 0) {
    return { ok: false, error: "amount must be a non-negative number" };
  }

  if (!category) {
    return { ok: false, error: "category is required" };
  }

  if (!description) {
    return { ok: false, error: "description is required" };
  }

  if (!date || !isValidIsoDate(date)) {
    return { ok: false, error: "date is required in YYYY-MM-DD format" };
  }

  return {
    ok: true,
    data: { amount, category, description, date },
  };
}
