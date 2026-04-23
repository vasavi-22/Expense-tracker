export default function ExpenseSummary({ total, summary }) {
  return (
    <>
      <p className="total">Total: Rs {total.toFixed(2)}</p>

      <h3>Summary by category</h3>
      <ul>
        {summary.map((item) => (
          <li key={item.category}>
            {item.category}: Rs {item.amount.toFixed(2)}
          </li>
        ))}
        {!summary.length && <li>No data yet.</li>}
      </ul>
    </>
  );
}
