"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateMatchesButton({ label }: { label: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function generate() {
    setLoading(true);
    try {
      await fetch("/api/match-listings", { method: "POST" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={generate}
      disabled={loading}
      className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
    >
      {loading ? "Generating…" : label}
    </button>
  );
}
