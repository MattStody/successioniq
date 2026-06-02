"use client";

import { useState } from "react";

interface BookmarkButtonProps {
  listingId: string;
  initialSaved: boolean;
  variant?: "icon" | "full";
}

export default function BookmarkButton({
  listingId,
  initialSaved,
  variant = "icon",
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    const prevSaved = saved;
    setSaved(!saved);

    try {
      if (prevSaved) {
        const res = await fetch(
          `/api/saved-listings?listing_id=${encodeURIComponent(listingId)}`,
          { method: "DELETE" }
        );
        if (!res.ok) setSaved(prevSaved);
      } else {
        const res = await fetch("/api/saved-listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listing_id: listingId }),
        });
        if (!res.ok) setSaved(prevSaved);
      }
    } catch {
      setSaved(prevSaved);
    } finally {
      setLoading(false);
    }
  }

  if (variant === "full") {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
          saved
            ? "border-blue-900 bg-blue-50 text-blue-900 hover:bg-blue-100"
            : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
        }`}
        aria-label={saved ? "Remove from saved" : "Save listing"}
      >
        <svg
          className={`w-4 h-4 transition-colors ${saved ? "fill-blue-900" : "fill-none stroke-current"}`}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
        {saved ? "Saved" : "Save listing"}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      disabled={loading}
      className={`p-2 rounded-lg transition-all ${
        saved
          ? "text-blue-900 hover:bg-blue-50"
          : "text-slate-300 hover:text-slate-500 hover:bg-slate-50"
      }`}
      aria-label={saved ? "Remove from saved" : "Save listing"}
    >
      <svg
        className={`w-5 h-5 transition-colors ${saved ? "fill-blue-900" : "fill-none stroke-current"}`}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
    </button>
  );
}
