"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

interface Props {
  userId: string;
  initialName: string | null;
  initialPhone: string | null;
  email: string;
  role: string;
}

export default function ProfileForm({ userId, initialName, initialPhone, email, role }: Props) {
  const [fullName, setFullName] = useState(initialName ?? "");
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName || null, phone: phone || null })
      .eq("id", userId);

    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const roleBadge: Record<string, string> = {
    seller: "bg-blue-50 text-blue-800 border-blue-200",
    buyer: "bg-emerald-50 text-emerald-800 border-emerald-200",
    advisor: "bg-amber-50 text-amber-800 border-amber-200",
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {(fullName || email).charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-900 truncate">{email}</div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${roleBadge[role] ?? roleBadge.seller}`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
        <input
          type="text"
          placeholder="Jane Smith"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
        <input
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors text-sm"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all"
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
      </button>
    </form>
  );
}
