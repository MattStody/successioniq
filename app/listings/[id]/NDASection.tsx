"use client";

import { useState } from "react";
import Link from "next/link";

interface NDAProps {
  listingId: string;
  industry: string;
  isAnonymous: boolean;
  isLoggedIn: boolean;
  hasSigned: boolean;
  // Only populated server-side when hasSigned is true
  initialContactEmail?: string;
  initialBusinessName?: string | null;
  // Pre-fill the form
  buyerName?: string;
  buyerEmail?: string;
}

const NDA_TEXT = `NON-DISCLOSURE AGREEMENT

In consideration of access to information about this business opportunity, I agree to:

1. Confidentiality — Keep all disclosed information, including financial data, customer lists, trade secrets, and operations ("Confidential Information"), strictly confidential.

2. Non-Disclosure — Not disclose Confidential Information to any third party without prior written consent from the seller.

3. Non-Solicitation — Not directly solicit employees, customers, or suppliers of the business for 24 months from the date of this agreement.

4. Permitted Use — Use Confidential Information solely to evaluate a potential acquisition of this business.

5. Term — This agreement is effective upon signing and remains in force for 24 months.

This is a legally binding agreement. By signing below I confirm I have read and understood these terms.`;

export default function NDASection({
  listingId,
  industry,
  isAnonymous,
  isLoggedIn,
  hasSigned,
  initialContactEmail,
  initialBusinessName,
  buyerName = "",
  buyerEmail = "",
}: NDAProps) {
  const [showModal, setShowModal] = useState(false);
  const [signed, setSigned] = useState(hasSigned);
  const [contactEmail, setContactEmail] = useState(initialContactEmail ?? null);
  const [businessName, setBusinessName] = useState(initialBusinessName ?? null);

  // Modal state
  const [fullName, setFullName] = useState(buyerName);
  const [email, setEmail] = useState(buyerEmail);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSign(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/ndas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, full_name: fullName, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit NDA");

      setContactEmail(data.contact_email);
      setBusinessName(data.business_name);
      setSigned(true);
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Already signed — show revealed details ────────────────────────────────
  if (signed) {
    return (
      <div className="space-y-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 border border-emerald-300 text-xs text-emerald-700 flex-shrink-0">
              ✓
            </span>
            <span className="text-sm font-semibold text-emerald-800">NDA Signed</span>
          </div>

          {contactEmail && (
            <div className="mb-3">
              <div className="text-xs text-emerald-700 uppercase tracking-widest mb-1">
                Seller Contact
              </div>
              <a
                href={`mailto:${contactEmail}`}
                className="text-sm font-medium text-emerald-900 hover:underline break-all"
              >
                {contactEmail}
              </a>
            </div>
          )}

          {isAnonymous && businessName && (
            <div>
              <div className="text-xs text-emerald-700 uppercase tracking-widest mb-1">
                Business Name
              </div>
              <div className="text-sm font-semibold text-emerald-900">{businessName}</div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400">
          Your signed NDA is on record · {new Date().getFullYear()}
        </p>
      </div>
    );
  }

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <Link
          href="/auth/login"
          className="block w-full text-center bg-blue-900 hover:bg-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
        >
          Sign in to request information
        </Link>
        <p className="text-center text-xs text-slate-400">
          Sign in, then sign a quick NDA to access contact details
        </p>
      </div>
    );
  }

  // ── Logged in, not signed ─────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-3">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
        >
          Sign NDA &amp; Get Contact Details
        </button>
        <p className="text-center text-xs text-slate-400">
          Takes 2 minutes · legally binding · free
        </p>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Non-Disclosure Agreement</h2>
                <p className="text-xs text-slate-500 mt-0.5">{industry} business listing</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5">
              {/* NDA text */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 max-h-52 overflow-y-auto">
                <pre className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
                  {NDA_TEXT}
                </pre>
              </div>

              {/* Form */}
              <form onSubmit={handleSign} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors text-sm"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    This serves as your digital signature.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-colors text-sm"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 flex-shrink-0 w-4 h-4 accent-blue-900 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors">
                    I have read and agree to the Non-Disclosure Agreement above and understand
                    this constitutes a legally binding commitment.
                  </span>
                </label>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-600 hover:border-slate-400 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!agreed || !fullName || !email || submitting}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all text-sm"
                  >
                    {submitting ? "Signing…" : "Sign & View Details →"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
