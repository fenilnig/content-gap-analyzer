"use client";

export default function Header({ analyzedAt, demoMode }) {
  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <header className="header" id="header">
      <div className="header-top">
        <div>
          <h1 className="header-title">
            <span className="accent">CONTENT</span>
            <span className="separator">::</span>
            GAP
            <span className="separator">//</span>
            <span className="accent">ANALYZER</span>
          </h1>
          <p className="header-subtitle">
            Cross-platform media gap detection system
          </p>
        </div>
        <div className="header-status">
          <div className="status-indicator">
            <span className={`status-dot ${demoMode ? "demo" : ""}`} />
            {demoMode ? "DEMO MODE" : "LIVE"}
          </div>
          <div className="status-indicator">
            LAST SYNC: {formatDate(analyzedAt)}
          </div>
        </div>
      </div>
    </header>
  );
}
