import Link from "next/link";

export const metadata = {
  title: "Non-Disclosure Agreement — SuccessionIQ",
};

export default function NDAPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link href="/listings" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to listings
        </Link>
      </div>

      <h1 className="font-serif text-3xl font-bold text-slate-900 mb-2">
        Non-Disclosure Agreement
      </h1>
      <p className="text-slate-500 text-sm mb-10">
        Effective upon digital signature via the SuccessionIQ platform
      </p>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            1. Confidentiality
          </h2>
          <p>
            All information provided regarding the business opportunity ("Business"), including
            but not limited to financial data, customer lists, trade secrets, operational
            processes, and business relationships ("Confidential Information"), shall be kept
            strictly confidential by the recipient.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            2. Non-Disclosure
          </h2>
          <p>
            The recipient agrees not to disclose, publish, or otherwise make available any
            Confidential Information to any third party without the prior written consent of
            the seller. This obligation survives the termination of any discussions or
            negotiations relating to the Business.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            3. Non-Solicitation
          </h2>
          <p>
            For a period of 24 months from the date of this agreement, the recipient agrees
            not to directly or indirectly solicit, recruit, or hire any employees, contractors,
            customers, or suppliers of the Business without the seller's prior written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            4. Permitted Use
          </h2>
          <p>
            The recipient agrees to use Confidential Information solely for the purpose of
            evaluating a potential acquisition of the Business. Any other use is strictly
            prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            5. Return of Information
          </h2>
          <p>
            Upon request from the seller, or upon the recipient deciding not to proceed with
            an acquisition, the recipient shall promptly return or destroy all Confidential
            Information and any copies thereof.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            6. Term
          </h2>
          <p>
            This agreement is effective upon digital signature and remains in full force for
            a period of 24 months. Obligations of confidentiality shall survive the expiry
            of this agreement with respect to any Confidential Information disclosed during
            the term.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            7. Remedies
          </h2>
          <p>
            The recipient acknowledges that any breach of this agreement may cause irreparable
            harm to the seller for which monetary damages may be inadequate, and the seller
            shall be entitled to seek equitable relief in addition to all other remedies
            available at law.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            8. Digital Signature
          </h2>
          <p>
            By entering your full legal name and checking the agreement box on the
            SuccessionIQ platform, you confirm that you have read, understood, and agree to
            be bound by the terms of this Non-Disclosure Agreement. This constitutes a
            legally binding electronic signature.
          </p>
        </section>
      </div>

      <p className="text-xs text-slate-400 text-center mt-8">
        SuccessionIQ · This agreement is governed by the laws of the jurisdiction in which
        the seller&apos;s business operates.
      </p>
    </div>
  );
}
