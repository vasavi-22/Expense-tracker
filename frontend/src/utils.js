export function calculateTotal(expenses) {
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  return Number(total.toFixed(2));
}

export function summarizeByCategory(expenses) {
  const summaryMap = expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + Number(expense.amount);
    return acc;
  }, {});

  return Object.entries(summaryMap)
    .map(([category, amount]) => ({ category, amount: Number(amount.toFixed(2)) }))
    .sort((a, b) => b.amount - a.amount);
}
