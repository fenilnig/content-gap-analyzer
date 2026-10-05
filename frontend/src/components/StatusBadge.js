"use client";

export default function StatusBadge({ status }) {
  const labels = {
    missing: "MISSING",
    matched: "MATCHED",
    uncertain: "UNCERTAIN",
  };

  return (
    <span className={`status-badge ${status}`}>
      <span className={`badge-dot ${status}`} />
      {labels[status] || status?.toUpperCase()}
    </span>
  );
}
