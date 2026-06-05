"use client"

import { useState, useEffect } from "react"

type SuggestionItem = {
  label: string
  value: string
  hint?: string
}

type Props = {
  industry: string
  section: string
  listingContext?: Record<string, unknown>
  onAdd: (text: string) => void
}

export default function SuggestionChips({ industry, section, listingContext, onAdd }: Props) {
  const [items, setItems] = useState<SuggestionItem[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setItems([])
    setSelected(new Set())

    fetch("/api/seller/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ industry, section, listingContext }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.items)) setItems(data.items)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industry, section])

  function toggle(value: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })
  }

  function addSelected() {
    const text = items
      .filter((i) => selected.has(i.value))
      .map((i) => i.value)
      .join(", ")
    if (text) onAdd(text)
    setSelected(new Set())
  }

  if (dismissed) return null

  return (
    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-900">
          Suggested for {industry} businesses ✦
        </span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Dismiss
        </button>
      </div>

      {loading ? (
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-7 rounded-full bg-blue-100 animate-pulse"
              style={{ width: `${60 + (i % 3) * 20}px` }}
            />
          ))}
        </div>
      ) : items.length === 0 ? null : (
        <>
          <div className="flex gap-2 flex-wrap mb-3">
            {items.map((item) => {
              const on = selected.has(item.value)
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggle(item.value)}
                  title={item.hint}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    on
                      ? "bg-blue-900 text-white border-blue-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-900"
                  }`}
                >
                  {on && <span>✓</span>}
                  {item.label}
                </button>
              )
            })}
          </div>

          {selected.size > 0 && (
            <button
              type="button"
              onClick={addSelected}
              className="text-xs font-semibold text-blue-900 bg-white border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Add {selected.size} selected →
            </button>
          )}
        </>
      )}
    </div>
  )
}
