export default function ExpenseControls({
  selectedCategory,
  sortByDate,
  onCategoryChange,
  onSortChange,
}) {
  return (
    <div className="controls">
      <label>
        Filter by category
        <input value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)} />
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={sortByDate} onChange={(event) => onSortChange(event.target.checked)} />
        Sort by newest date
      </label>
    </div>
  );
}
