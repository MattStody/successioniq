"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import Papa from "papaparse";

// ─── Types ────────────────────────────────────────────────────────────────────

type RowStatus = "valid" | "warning" | "invalid";

interface ParsedRow {
  index: number;
  status: RowStatus;
  errors: string[];
  warnings: string[];
  business_name: string;
  is_anonymous: boolean;
  industry: string;
  country: string;
  region: string;
  annual_revenue: number;
  annual_profit: number;
  years_operating: number;
  asking_price: number | null;
  owner_dependency: number | null;
  revenue_trend: string;
  whats_included: string;
  transition_period: string;
  preferred_buyer: string;
  contact_email: string;
}

interface PublishResult {
  succeeded: number;
  failed: number;
  total: number;
  errors: Record<number, string>;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRow(raw: Record<string, string>, index: number): ParsedRow {
  const errors: string[] = [];
  const warnings: string[] = [];

  const req = (field: string, label: string) => {
    if (!raw[field]?.trim()) errors.push(`${label} is required`);
    return raw[field]?.trim() ?? "";
  };

  const industry = req("industry", "Industry");
  const country = req("country", "Country");
  const region = req("region", "Region");
  const whats_included = req("whats_included", "What's included");
  const transition_period = req("transition_period", "Transition period");
  const preferred_buyer = req("preferred_buyer", "Preferred buyer");
  const contact_email = req("contact_email", "Contact email");

  if (contact_email && !EMAIL_RE.test(contact_email)) {
    errors.push("Contact email is invalid");
  }

  const annual_revenue = parseFloat(raw.annual_revenue);
  if (!raw.annual_revenue || isNaN(annual_revenue) || annual_revenue <= 0) {
    errors.push("Annual revenue must be a positive number");
  }

  const annual_profit = parseFloat(raw.annual_profit);
  if (raw.annual_profit === undefined || isNaN(annual_profit)) {
    errors.push("Annual profit is required");
  }

  const years_operating = parseInt(raw.years_operating, 10);
  if (!raw.years_operating || isNaN(years_operating) || years_operating <= 0) {
    errors.push("Years operating must be a positive number");
  }

  const asking_price = raw.asking_price ? parseFloat(raw.asking_price) : null;
  if (raw.asking_price && (isNaN(asking_price!) || asking_price! <= 0)) {
    errors.push("Asking price must be a positive number if provided");
  }

  const owner_dependency = raw.owner_dependency
    ? parseInt(raw.owner_dependency, 10)
    : null;
  if (
    raw.owner_dependency &&
    (isNaN(owner_dependency!) || owner_dependency! < 1 || owner_dependency! > 10)
  ) {
    errors.push("Owner dependency must be between 1 and 10");
  }

  if (!raw.revenue_trend?.trim()) warnings.push("Revenue trend not specified");
  if (!raw.owner_dependency?.trim()) warnings.push("Owner dependency not specified");
  if (!raw.asking_price?.trim()) warnings.push("Asking price not specified");

  const status: RowStatus =
    errors.length > 0 ? "invalid" : warnings.length > 0 ? "warning" : "valid";

  return {
    index,
    status,
    errors,
    warnings,
    business_name: raw.business_name?.trim() ?? "",
    is_anonymous:
      raw.is_anonymous?.toLowerCase() === "true" || !raw.business_name?.trim(),
    industry,
    country,
    region,
    annual_revenue: isNaN(annual_revenue) ? 0 : annual_revenue,
    annual_profit: isNaN(annual_profit) ? 0 : annual_profit,
    years_operating: isNaN(years_operating) ? 0 : years_operating,
    asking_price,
    owner_dependency,
    revenue_trend: raw.revenue_trend?.trim() ?? "",
    whats_included,
    transition_period,
    preferred_buyer,
    contact_email,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

const STATUS_STYLES: Record<RowStatus, { row: string; badge: string; label: string }> = {
  valid: {
    row: "bg-emerald-50/50 border-emerald-100",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    label: "Ready",
  },
  warning: {
    row: "bg-amber-50/50 border-amber-100",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    label: "Missing optional",
  },
  invalid: {
    row: "bg-red-50/50 border-red-100",
    badge: "bg-red-100 text-red-800 border-red-200",
    label: "Invalid",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BulkUploadClient() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<PublishResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = (results.data as Record<string, string>[]).map(
          (raw, i) => validateRow(raw, i)
        );
        setRows(parsed);
        setResult(null);
      },
    });
  }, []);

  const handleFile = (file: File | undefined) => {
    if (!file || !file.name.endsWith(".csv")) return;
    processFile(file);
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [processFile]
  );

  const validRows = rows.filter((r) => r.status !== "invalid");
  const invalidRows = rows.filter((r) => r.status === "invalid");

  const handlePublish = async () => {
    if (validRows.length === 0) return;
    setPublishing(true);

    const res = await fetch("/api/broker/bulk-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: validRows }),
    });

    const data = await res.json();
    setResult(data);
    setPublishing(false);

    if (data.succeeded > 0) {
      setRows([]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/broker/dashboard"
              className="text-sm text-slate-400 hover:text-slate-700 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
          <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">
            Bulk Upload Listings
          </h1>
          <p className="text-slate-500 text-sm max-w-lg">
            Upload a CSV file to create multiple listings at once. We&apos;ll
            validate each row and auto-generate professional descriptions.
          </p>
        </div>

        <a
          href="/broker/template.csv"
          download
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900 text-sm font-medium transition-colors shadow-sm"
        >
          ↓ Download Template
        </a>
      </div>

      {/* Success result */}
      {result && (
        <div
          className={`rounded-2xl px-6 py-5 mb-8 border ${
            result.failed === 0
              ? "bg-emerald-50 border-emerald-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`font-semibold mb-1 ${
                  result.failed === 0 ? "text-emerald-900" : "text-amber-900"
                }`}
              >
                {result.succeeded === result.total
                  ? `All ${result.succeeded} listings published successfully`
                  : `${result.succeeded} of ${result.total} listings published`}
              </p>
              {result.failed > 0 && (
                <p className="text-sm text-amber-800">
                  {result.failed} listing{result.failed !== 1 ? "s" : ""} failed to save.
                </p>
              )}
            </div>
            <Link
              href="/broker/dashboard"
              className="text-sm font-medium text-blue-900 hover:underline"
            >
              View Dashboard →
            </Link>
          </div>
        </div>
      )}

      {/* Upload area */}
      {rows.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="text-4xl mb-4">📂</div>
          <p className="text-slate-900 font-semibold mb-1">
            Drop your CSV file here
          </p>
          <p className="text-slate-400 text-sm mb-6">or click to browse</p>
          <div className="inline-flex items-center gap-2 bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium">
            Choose CSV file
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Use the template above to ensure correct formatting
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}

      {/* Validation table */}
      {rows.length > 0 && (
        <>
          {/* Summary */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-slate-900">
                {rows.length} row{rows.length !== 1 ? "s" : ""} parsed
              </span>
              <span className="text-emerald-700 font-medium">
                {validRows.length} ready
              </span>
              {invalidRows.length > 0 && (
                <span className="text-red-600 font-medium">
                  {invalidRows.length} need attention
                </span>
              )}
            </div>
            <button
              onClick={() => { setRows([]); setResult(null); }}
              className="text-sm text-slate-400 hover:text-slate-700 transition-colors"
            >
              Clear & re-upload
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">
                      #
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Issues
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => {
                    const style = STATUS_STYLES[row.status];
                    return (
                      <tr key={row.index} className={`${style.row}`}>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {row.index + 1}
                        </td>
                        <td className="px-4 py-3 text-slate-900 font-medium">
                          {row.is_anonymous || !row.business_name
                            ? <span className="text-slate-400 italic">Anonymous</span>
                            : row.business_name}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.industry || <span className="text-red-400">—</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-900">
                          {row.annual_revenue > 0
                            ? fmtCurrency(row.annual_revenue)
                            : <span className="text-red-400">—</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-900">
                          {fmtCurrency(row.annual_profit)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-md border ${style.badge}`}
                          >
                            {style.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 max-w-xs">
                          {row.errors.length > 0 && (
                            <ul className="space-y-0.5">
                              {row.errors.map((e, i) => (
                                <li key={i} className="text-red-600">
                                  • {e}
                                </li>
                              ))}
                            </ul>
                          )}
                          {row.warnings.length > 0 && row.errors.length === 0 && (
                            <ul className="space-y-0.5">
                              {row.warnings.map((w, i) => (
                                <li key={i} className="text-amber-700">
                                  • {w}
                                </li>
                              ))}
                            </ul>
                          )}
                          {row.errors.length === 0 && row.warnings.length === 0 && (
                            <span className="text-emerald-600">✓ All good</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preview cards — valid rows only */}
          {validRows.length > 0 && (
            <div className="mb-8">
              <h2 className="text-base font-semibold text-slate-900 mb-4">
                Listing Preview ({validRows.length})
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {validRows.map((row) => (
                  <div
                    key={row.index}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-widest text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                        {row.industry}
                      </span>
                      {row.is_anonymous && (
                        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          Anon
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-0.5">
                      {row.is_anonymous || !row.business_name
                        ? `${row.industry} Business`
                        : row.business_name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      {row.region}, {row.country}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Revenue</div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {fmtCurrency(row.annual_revenue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Profit</div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {fmtCurrency(row.annual_profit)}
                        </div>
                      </div>
                      {row.asking_price && (
                        <div>
                          <div className="text-xs text-slate-400 mb-0.5">Asking</div>
                          <div className="font-semibold text-slate-900 text-sm">
                            {fmtCurrency(row.asking_price)}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Years</div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {row.years_operating}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 italic">
                      Description AI-generated on publish
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setRows([]); setResult(null); }}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 text-sm font-medium transition-colors bg-white"
            >
              Fix & Re-upload
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing || validRows.length === 0}
              className="flex-1 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-none"
            >
              {publishing
                ? "Generating descriptions & publishing…"
                : `Publish ${validRows.length} Valid Listing${validRows.length !== 1 ? "s" : ""} →`}
            </button>
          </div>

          {publishing && (
            <p className="text-center text-xs text-slate-400 mt-3">
              Claude is writing descriptions for each listing — this may take 15–30 seconds.
            </p>
          )}
        </>
      )}
    </div>
  );
}
