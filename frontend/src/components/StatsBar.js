"use client";

import { useState, useEffect } from "react";

function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }

    let start = 0;
    const increment = value / (duration / 30);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{display}</>;
}

export default function StatsBar({ data }) {
  const stats = [
    {
      label: "YouTube Total",
      value: data?.total_youtube ?? 0,
      colorClass: "cyan",
      cardClass: "youtube",
      suffix: "uploads",
    },
    {
      label: "Instagram Total",
      value: data?.total_instagram ?? 0,
      colorClass: "cyan",
      cardClass: "instagram",
      suffix: "reels",
    },
    {
      label: "Matched",
      value: data?.matched ?? 0,
      colorClass: "green",
      cardClass: "matched",
      suffix: "synced",
    },
    {
      label: "Missing",
      value: data?.missing ?? 0,
      colorClass: "red",
      cardClass: "missing",
      suffix: "to export",
    },
  ];

  return (
    <div className="stats-bar" id="stats-bar">
      {stats.map((stat) => (
        <div key={stat.label} className={`stat-card ${stat.cardClass}`}>
          <div className="stat-label">{stat.label}</div>
          <div className={`stat-value ${stat.colorClass}`}>
            <AnimatedNumber value={stat.value} />
          </div>
          <div className="stat-suffix">{stat.suffix}</div>
        </div>
      ))}
    </div>
  );
}
