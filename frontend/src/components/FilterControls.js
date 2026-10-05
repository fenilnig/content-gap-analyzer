"use client";

export default function FilterControls({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
}) {
  const filters = [
    { key: "all", label: "All" },
    { key: "missing", label: "Missing" },
    { key: "matched", label: "Matched" },
    { key: "uncertain", label: "Uncertain" },
  ];

  return (
    <div className="filter-bar" id="filter-bar">
      <div className="filter-buttons">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`filter-btn ${activeFilter === f.key ? "active" : ""}`}
            onClick={() => onFilterChange(f.key)}
            id={`filter-${f.key}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <span className="results-count">
        {resultCount} / {totalCount} entries
      </span>

      <input
        type="text"
        className="search-input"
        placeholder="Search titles..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        id="search-input"
      />
    </div>
  );
}
