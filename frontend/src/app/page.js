"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import FilterControls from "@/components/FilterControls";
import GapTable from "@/components/GapTable";

// ─── Comprehensive demo data (used when backend is unreachable) ─────────────
const DEMO_DATA = {
  total_youtube: 20,
  total_instagram: 12,
  matched: 8,
  missing: 10,
  uncertain: 2,
  analyzed_at: new Date().toISOString(),
  videos: [
    {
      video_id: "dQw4w9WgXcQ",
      title: "Building a Neural Network from Scratch in Python",
      description: "Complete walkthrough of implementing a feedforward neural network using only NumPy.",
      thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      published_at: "2026-07-15T14:30:00Z",
      match_status: "matched",
      match_method: "title",
      match_confidence: 0.96,
      matched_reel_id: "ig_001",
      matched_reel_permalink: "https://instagram.com/reel/abc123",
    },
    {
      video_id: "abc123def",
      title: "Day in My Life as a Software Developer — Remote Edition",
      description: "Behind the scenes of a typical workday including stand-ups, deep work blocks, and debugging sessions.",
      thumbnail_url: "https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg",
      published_at: "2026-07-10T09:00:00Z",
      match_status: "missing",
      match_method: "none",
      match_confidence: 0,
    },
    {
      video_id: "xyz789ghi",
      title: "React vs Vue vs Angular — 2026 Framework Showdown",
      description: "Benchmarks, DX comparison, and real-world project analysis of the big three JS frameworks.",
      thumbnail_url: "https://img.youtube.com/vi/Tn6-PIqc4UM/mqdefault.jpg",
      published_at: "2026-06-28T16:45:00Z",
      match_status: "matched",
      match_method: "hash",
      match_confidence: 0.91,
      matched_reel_id: "ig_002",
    },
    {
      video_id: "saas30days",
      title: "How I Built a SaaS Product in 30 Days",
      description: "From idea validation to first paying customer — the full indie hacker journey.",
      thumbnail_url: "https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg",
      published_at: "2026-06-20T12:00:00Z",
      match_status: "missing",
      match_method: "none",
      match_confidence: 0,
    },
    {
      video_id: "rustbeg01",
      title: "Rust for Beginners — Memory Safety Without the Pain",
      description: "An approachable introduction to Rust's ownership model and borrow checker.",
      thumbnail_url: "https://img.youtube.com/vi/DLzxrzFCyOs/mqdefault.jpg",
      published_at: "2026-06-15T08:30:00Z",
      match_status: "matched",
      match_method: "title",
      match_confidence: 0.94,
      matched_reel_id: "ig_003",
    },
    {
      video_id: "k8stut02",
      title: "Kubernetes Crash Course — Deploy Your First Cluster",
      description: "Hands-on tutorial deploying a multi-container app with kubectl and Helm.",
      thumbnail_url: "https://img.youtube.com/vi/hY7m5jjJ9mM/mqdefault.jpg",
      published_at: "2026-06-08T11:00:00Z",
      match_status: "missing",
      match_method: "none",
      match_confidence: 0,
    },
    {
      video_id: "designsys",
      title: "Design Systems That Scale — Tokens, Components, and Docs",
      description: "How to build a design system that actually gets adopted across your org.",
      thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      published_at: "2026-06-01T15:00:00Z",
      match_status: "uncertain",
      match_method: "audio",
      match_confidence: 0.72,
      matched_reel_id: "ig_004",
    },
    {
      video_id: "gpucomp01",
      title: "GPU Computing with CUDA — A Practical Guide",
      description: "Writing your first CUDA kernels and understanding GPU architecture.",
      thumbnail_url: "https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg",
      published_at: "2026-05-25T10:30:00Z",
      match_status: "missing",
      match_method: "none",
      match_confidence: 0,
    },
    {
      video_id: "tailwnd04",
      title: "Tailwind CSS 4.0 — What Changed and Why It Matters",
      description: "Deep dive into the new engine, CSS-first configuration, and migration path.",
      thumbnail_url: "https://img.youtube.com/vi/Tn6-PIqc4UM/mqdefault.jpg",
      published_at: "2026-05-18T14:00:00Z",
      match_status: "matched",
      match_method: "title",
      match_confidence: 0.98,
      matched_reel_id: "ig_005",
    },
    {
      video_id: "aiagents",
      title: "Building AI Agents with LangChain and Tool Use",
      description: "Architecting autonomous agents that can reason, plan, and execute complex tasks.",
      thumbnail_url: "https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg",
      published_at: "2026-05-12T09:00:00Z",
      match_status: "missing",
      match_method: "none",
      match_confidence: 0,
    },
    {
      video_id: "sysdes03",
      title: "System Design Interview — URL Shortener at Scale",
      description: "Designing a distributed URL shortening service handling billions of requests.",
      thumbnail_url: "https://img.youtube.com/vi/DLzxrzFCyOs/mqdefault.jpg",
      published_at: "2026-05-05T16:30:00Z",
      match_status: "matched",
      match_method: "hash",
      match_confidence: 0.88,
      matched_reel_id: "ig_006",
    },
    {
      video_id: "docker101",
      title: "Docker Deep Dive — Multi-Stage Builds and Compose Profiles",
      description: "Advanced Docker techniques for production-grade containerization.",
      thumbnail_url: "https://img.youtube.com/vi/hY7m5jjJ9mM/mqdefault.jpg",
      published_at: "2026-04-28T13:00:00Z",
      match_status: "missing",
      match_method: "none",
      match_confidence: 0,
    },
    {
      video_id: "webperf01",
      title: "Web Performance — Core Web Vitals Optimization Playbook",
      description: "Practical techniques to ace LCP, CLS, and INP scores on any stack.",
      thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      published_at: "2026-04-20T10:00:00Z",
      match_status: "matched",
      match_method: "title",
      match_confidence: 0.93,
      matched_reel_id: "ig_007",
    },
    {
      video_id: "typescript",
      title: "TypeScript Generics Explained — From Zero to Hero",
      description: "Master generic types, constraints, mapped types, and conditional types.",
      thumbnail_url: "https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg",
      published_at: "2026-04-14T11:30:00Z",
      match_status: "missing",
      match_method: "none",
      match_confidence: 0,
    },
    {
      video_id: "goconc01",
      title: "Go Concurrency Patterns — Goroutines, Channels, and Select",
      description: "Idiomatic concurrency in Go with real-world pipeline and fan-out examples.",
      thumbnail_url: "https://img.youtube.com/vi/Tn6-PIqc4UM/mqdefault.jpg",
      published_at: "2026-04-07T08:00:00Z",
      match_status: "matched",
      match_method: "hash",
      match_confidence: 0.85,
      matched_reel_id: "ig_008",
    },
    {
      video_id: "llmfinet",
      title: "Fine-Tuning LLMs on Custom Data — LoRA and QLoRA Tutorial",
      description: "Step-by-step guide to fine-tuning open-source models on your own dataset.",
      thumbnail_url: "https://img.youtube.com/vi/9bZkp7q19f0/mqdefault.jpg",
      published_at: "2026-03-30T15:00:00Z",
      match_status: "missing",
      match_method: "none",
      match_confidence: 0,
    },
    {
      video_id: "authflow",
      title: "Auth in 2026 — Passkeys, OAuth 2.1, and Zero-Trust Architecture",
      description: "Modern authentication and authorization patterns for web applications.",
      thumbnail_url: "https://img.youtube.com/vi/DLzxrzFCyOs/mqdefault.jpg",
      published_at: "2026-03-22T12:00:00Z",
      match_status: "missing",
      match_method: "none",
      match_confidence: 0,
    },
    {
      video_id: "grafana01",
      title: "Observability Stack — Grafana, Prometheus, and Loki Setup",
      description: "Full monitoring and logging pipeline for microservices architecture.",
      thumbnail_url: "https://img.youtube.com/vi/hY7m5jjJ9mM/mqdefault.jpg",
      published_at: "2026-03-15T09:30:00Z",
      match_status: "uncertain",
      match_method: "audio",
      match_confidence: 0.67,
      matched_reel_id: "ig_009",
    },
    {
      video_id: "edgecomp",
      title: "Edge Computing with Cloudflare Workers and Durable Objects",
      description: "Building globally distributed stateful applications on the edge.",
      thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      published_at: "2026-03-08T14:00:00Z",
      match_status: "matched",
      match_method: "title",
      match_confidence: 0.97,
      matched_reel_id: "ig_010",
    },
    {
      video_id: "termsetup",
      title: "My 2026 Terminal Setup — Ghostty, Starship, and Custom Scripts",
      description: "Complete dev environment walkthrough with dotfiles and automation.",
      thumbnail_url: "https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg",
      published_at: "2026-03-01T10:00:00Z",
      match_status: "missing",
      match_method: "none",
      match_confidence: 0,
    },
  ],
};

const API_BASE = "http://localhost:8000";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/api/analysis/gap`, {
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.warn("Backend unreachable, using demo data:", err.message);
        setData(DEMO_DATA);
        setError("demo");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredVideos = useMemo(() => {
    if (!data?.videos) return [];

    let vids = data.videos;

    // Status filter
    if (activeFilter !== "all") {
      vids = vids.filter((v) => v.match_status === activeFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      vids = vids.filter(
        (v) =>
          v.title?.toLowerCase().includes(q) ||
          v.description?.toLowerCase().includes(q)
      );
    }

    return vids;
  }, [data, activeFilter, searchQuery]);

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-screen">
          <div className="loading-text">
            ANALYZING
            <span className="loading-cursor" />
          </div>
          <div className="loading-progress" />
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header
        analyzedAt={data?.analyzed_at}
        demoMode={error === "demo"}
      />

      <StatsBar data={data} />

      <FilterControls
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filteredVideos.length}
        totalCount={data?.videos?.length ?? 0}
      />

      <GapTable videos={filteredVideos} />

      <footer className="footer">
        <span className="footer-text">
          <span className="highlight">CONTENT::GAP</span>//ANALYZER v1.0
        </span>
        <span className="footer-text">
          ENGINE: VIDEOHASH + CHROMAPRINT + FUZZY
        </span>
      </footer>
    </div>
  );
}
