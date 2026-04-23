export default function ExpenseTable({ expenses }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td>{expense.date}</td>
            <td>{expense.category}</td>
            <td>{expense.description}</td>
            <td>{expense.amount.toFixed(2)}</td>
          </tr>
        ))}
        {!expenses.length && (
          <tr>
            <td colSpan={4}>No expenses found for current filters.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
