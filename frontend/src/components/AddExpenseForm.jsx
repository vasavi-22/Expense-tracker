export default function AddExpenseForm({
  form,
  onFieldChange,
  onSubmit,
}) {
  return (
    <form className="card form" onSubmit={onSubmit}>
      <h2>Add expense</h2>
      <label>
        Amount
        <input
          name="amount"
          type="number"
          min="0"
          step="0.01"
          required
          value={form.amount}
          onChange={onFieldChange}
        />
      </label>
      <label>
        Category
        <input name="category" required value={form.category} onChange={onFieldChange} />
      </label>
      <label>
        Description
        <input name="description" required value={form.description} onChange={onFieldChange} />
      </label>
      <label>
        Date
        <input name="date" type="date" required value={form.date} onChange={onFieldChange} />
      </label>
      <button type="submit">Add Expense</button>
    </form>
  );
}
