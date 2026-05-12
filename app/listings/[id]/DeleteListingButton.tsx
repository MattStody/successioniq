"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteListingButton({ listingId }: { listingId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    const res = await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setDeleting(false);
      setConfirming(false);
    }
  };

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
      >
        Delete listing
      </button>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
      <p className="text-sm text-red-700 mb-3">Remove this listing permanently?</p>
      <div className="flex gap-2">
        <button
          onClick={() => setConfirming(false)}
          className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Yes, delete"}
        </button>
      </div>
    </div>
  );
}
