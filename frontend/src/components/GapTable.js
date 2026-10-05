"use client";

import { useState, useMemo } from "react";
import StatusBadge from "./StatusBadge";

export default function GapTable({ videos }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    if (!videos || !sortKey) return videos || [];

    return [...videos].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      // Handle numeric values
      if (sortKey === "match_confidence") {
        aVal = aVal ?? 0;
        bVal = bVal ?? 0;
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Handle dates
      if (sortKey === "published_at") {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Handle strings
      aVal = (aVal || "").toString().toLowerCase();
      bVal = (bVal || "").toString().toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [videos, sortKey, sortDir]);

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const columns = [
    { key: "index", label: "#", sortable: false },
    { key: "thumbnail", label: "Preview", sortable: false },
    { key: "title", label: "Title", sortable: true },
    { key: "published_at", label: "Date", sortable: true },
    { key: "match_status", label: "Status", sortable: true },
    { key: "match_method", label: "Method", sortable: true },
    { key: "match_confidence", label: "Confidence", sortable: true },
    { key: "action", label: "Action", sortable: false },
  ];

  if (!sorted || sorted.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">
          <div className="empty-state-icon">⬚</div>
          <div className="empty-state-text">No entries match current filters</div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper" id="gap-table">
      <table className="gap-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                className={sortKey === col.key ? "sorted" : ""}
                style={{ cursor: col.sortable ? "pointer" : "default" }}
              >
                {col.label}
                {col.sortable && (
                  <span className="sort-icon">
                    {sortKey === col.key
                      ? sortDir === "asc"
                        ? "▲"
                        : "▼"
                      : "⬍"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((video, idx) => (
            <tr key={video.video_id || idx}>
              <td className="row-index">{String(idx + 1).padStart(2, "0")}</td>

              <td className="thumb-cell">
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="video-thumb"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="video-thumb"
                    style={{ background: "var(--bg-primary)" }}
                  />
                )}
              </td>

              <td className="title-cell">
                <span className="video-title" title={video.title}>
                  {video.title}
                </span>
                {video.description && (
                  <span className="video-description" title={video.description}>
                    {video.description}
                  </span>
                )}
              </td>

              <td className="date-cell">{formatDate(video.published_at)}</td>

              <td>
                <StatusBadge status={video.match_status} />
              </td>

              <td className="method-cell">
                <span className={`method-tag ${video.match_method}`}>
                  {video.match_method === "none" ? "—" : video.match_method}
                </span>
              </td>

              <td className="confidence-cell">
                <div className="confidence-bar-wrap">
                  <div className="confidence-bar">
                    <div
                      className={`confidence-fill ${
                        video.match_confidence >= 0.8
                          ? "high"
                          : video.match_confidence >= 0.5
                          ? "medium"
                          : "low"
                      }`}
                      style={{
                        width: `${(video.match_confidence || 0) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="confidence-value">
                    {video.match_confidence
                      ? `${Math.round(video.match_confidence * 100)}%`
                      : "—"}
                  </span>
                </div>
              </td>

              <td className="action-cell">
                <button
                  className={`export-btn ${
                    video.match_status === "matched" ? "disabled" : ""
                  }`}
                  id={`export-${video.video_id}`}
                >
                  {video.match_status === "missing"
                    ? "EXPORT →"
                    : video.match_status === "uncertain"
                    ? "REVIEW"
                    : "—"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
