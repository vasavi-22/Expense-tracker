export function calculateTotal(expenses) {
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  return Number(total.toFixed(2));
}
