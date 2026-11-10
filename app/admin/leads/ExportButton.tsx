"use client";

type Lead = {
  email: string;
  industry: string | null;
  country: string | null;
  region: string | null;
  source: string | null;
  created_at: string;
};

/** Client-side CSV download of the current leads. */
export default function ExportButton({ leads }: { leads: Lead[] }) {
  function download() {
    const header = ["Email", "Industry", "Country", "Region", "Source", "Captured"];
    const esc = (s: unknown) => `"${String(s ?? "").replace(/"/g, '""')}"`;
    const body = leads.map((l) =>
      [l.email, l.industry, l.country, l.region, l.source, l.created_at].map(esc).join(",")
    );
    const csv = [header.map(esc).join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fairmark-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={leads.length === 0}
      className="inline-flex items-center rounded-xl bg-[#4F6BFF] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#3f57e6] disabled:cursor-not-allowed disabled:bg-[#C2D0FF]"
    >
      Export CSV
    </button>
  );
}
