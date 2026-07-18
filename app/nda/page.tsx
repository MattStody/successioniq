import Link from "next/link";

export const metadata = {
  title: "Non-Disclosure Agreement — Mercato",
};

const SECTIONS = [
  {
    title: "1. CONFIDENTIAL INFORMATION.",
    body: `Except as set forth in Section 2 below, "Confidential Information" means all non-public, confidential or proprietary information disclosed on or after the Effective Date, by the Disclosing Party to the Recipient or its affiliates, or to any of such Recipient's or its affiliates' employees, officers, directors, partners, shareholders, agents, attorneys, accountants, financing sources or advisors (collectively "Representatives"), however disclosed, including, without limitation: a) all information concerning the Disclosing Party's and its affiliates', and their customers' and suppliers' past, present and future finances, customer information, supplier information, products, services, know-how, forecasts, business, marketing, development, sales and other commercial strategies; b) source and object code, programs, drawings, the Disclosing Party's unpatented inventions, ideas, methods and discoveries, trade secrets, unpublished patent applications and other confidential intellectual property; and c) all notes, analyses, compilations, reports, studies, samples, data, statistics, summaries, interpretations and other materials prepared by or for the Recipient or its Representatives that contain or derive from the foregoing, and any other information that would reasonably be considered non-public, confidential or proprietary given the nature of the information and the Parties' businesses.`,
  },
  {
    title: "2. EXCLUSIONS FROM CONFIDENTIAL INFORMATION.",
    body: `Except as required by applicable federal, state or local law or regulation, the term "Confidential Information" as used in this Agreement shall not include information that: a) at the time of disclosure is, or thereafter becomes, generally available to and known by the public other than as a result of, directly or indirectly, any act or omission by the Recipient or any of its Representatives; b) at the time of disclosure is, or thereafter becomes, available to the Recipient on a non-confidential basis from a third-party source, provided that such third party is not and was not prohibited from disclosing such Confidential Information to the Recipient by any contractual obligation; c) was known by or in the possession of the Recipient, as established by documentary evidence, prior to being disclosed by or on behalf of the Disclosing Party pursuant to this Agreement; d) was or is independently developed by the Recipient, as established by documentary evidence, without reference to Confidential Information; or e) is Residual Information. "Residual Information" means the ideas, know-how and techniques that would be retained in the unaided memory of an ordinary person skilled in the art, not intent on appropriating the proprietary information of the Disclosing Party, as a result of such person's access to, use, review, evaluation, or testing of the Confidential Information of the Disclosing Party for the purposes described herein. A person's memory is unaided if the person has not intentionally memorized the Confidential Information for the purpose of retaining and subsequently using or disclosing it. Nothing herein shall be deemed to grant to the Recipient a license under the Disclosing Party's intellectual property rights.`,
  },
  {
    title: "3. RECIPIENT OBLIGATIONS.",
    body: `The Recipient shall protect and safeguard the confidentiality of all Confidential Information with at least the same degree of care as the Recipient would protect its own confidential information, but in no event with less than a commercially reasonable degree of care; not use the Confidential Information, or permit it to be accessed or used, for any purpose other than the Purpose, including without limitation, to reverse engineer, disassemble, decompile or design around confidential intellectual property; not disclose any such Confidential Information in relation to the Purpose and are informed of the obligations hereunder and agree to abide by the same. Recipient will promptly notify the Disclosing Party of any unauthorized disclosure of Confidential Information or other breaches of this Agreement.`,
  },
  {
    title: "4. REQUIRED DISCLOSURE.",
    body: `Any Disclosure by the Recipient or its Representatives of any of the Disclosing Party's Confidential Information pursuant to applicable federal, state or local law, regulation or a valid order issued by a court or governmental agency of competent jurisdiction (a "Legal Order") shall be subject to the terms of this Section. Prior to making any such disclosure, the Recipient shall make commercially reasonable efforts to provide the Disclosing Party with: a) prompt written notice of such requirement so that the Disclosing Party may seek a protective order or other remedy; and b) reasonable assistance in opposing such disclosure or seeking a protective order or other limitations on disclosure. If, after providing such notice and assistance as required herein, the Recipient remains subject to a Legal Order to disclose any Confidential Information, the Recipient (or its Representatives or other persons to whom such Legal Order is directed) shall disclose only that portion of the Confidential Information which, on the advice of the Recipient's legal counsel, such Legal Order specifically requires. Notwithstanding the foregoing, Confidential Information may be disclosed, and no notice as referenced above is required to be provided, pursuant to requests for information in connection with routine supervisory examinations by regulatory authorities with the jurisdiction over Recipient or its Representatives and not directed at the Disclosing Party or the Purpose; provided that Recipient or its Representatives, as applicable, inform any such authority of the confidential nature of the information disclosed to them and to keep such information confidential in accordance with such authority's policies and procedures.`,
  },
  {
    title: "5. DESTRUCTION OF CONFIDENTIAL INFORMATION.",
    body: `At the Disclosing Party's written request at any time during the term of this Agreement, the Recipient and its Representatives shall promptly destroy all copies, whether in written, electronic or other form or media, of the Disclosing Party's Confidential Information, or destroy all such copies and confirm the same in writing to the Disclosing Party; provided, that the Recipient and its Representatives may retain such Confidential Information as is necessary to enable it to comply with its reasonable document retention policies.`,
  },
  {
    title: "6. TERM AND TERMINATION.",
    body: `The term of this Agreement shall commence on the Effective Date and shall expire 24 months from the Effective Date, provided that either Party may terminate this Agreement at any time by providing notice to the other Party. Notwithstanding anything to the contrary herein, each Party's rights and obligations under this Agreement, irrespective of termination of this Agreement, shall survive until the 18-month anniversary of this Agreement, even after the destruction of Confidential Information by the Recipient (the "Confidential Period").`,
  },
  {
    title: "7. NO TRANSFER OF RIGHTS, TITLE OR INTEREST.",
    body: `The Disclosing Party hereby retains its entire right, title and interest, including all intellectual property rights, in and to all Confidential Information.`,
  },
  {
    title: "8. NO OTHER OBLIGATION.",
    body: `The Parties agree that this Agreement does not require or compel the Disclosing Party to disclose any Confidential Information to the Recipient or obligate any party to enter into a business or contractual relationship. Either party may terminate discussions at any time.`,
  },
  {
    title: "9. REMEDIES.",
    body: `The Recipient acknowledges and agrees that money damages might not be a sufficient remedy for any breach or threatened breach of this Agreement by the Recipient or its Representatives. Therefore, in addition to all other remedies available at law, the Disclosing Party shall be entitled to seek specific performance and injunctive and other equitable relief as a remedy for any such breach or threatened breach, and the Recipient hereby waives any requirement for the securing or posting of any bond or the showing of actual monetary damages in connection with such claim.`,
  },
  {
    title: "10. NON-SOLICITATION AND NON-CIRCUMVENTION.",
    body: `During the term of this Agreement, without the Disclosing Party's prior written consent, the Recipient and its Representatives shall not contact or solicit an employee of the Disclosing party for the purpose of hiring them, use Confidential Information to solicit the business of any client, customer or licensee of the Disclosing Party or outside of the ordinary course of business, directly or indirectly contact or participate in communications with any disclosed companies, entities or persons (including each of their affiliates, parents or subsidiaries). Notwithstanding anything to the contrary herein, the Recipient and its Representatives shall not be restricted from hiring any employee of Disclosing Party who responds to a general solicitation for employment not directed towards the Disclosing Party's employees.`,
  },
  {
    title: "11. GOVERNING LAW, JURISDICTION AND VENUE.",
    body: `This Agreement shall be governed by and construed in accordance with the internal laws of the State of Delaware without giving effect to any choice or conflict of law provision or rule that would cause the application of Laws of any jurisdiction other than those of the State of Delaware. Any legal suit, action or proceeding arising out of or related to this Agreement or the matters contemplated hereunder shall be instituted exclusively in the federal courts of the United States or the courts of the State of Delaware.`,
  },
  {
    title: "12. NOTICES.",
    body: `All notices, requests, consents, claims, demands, waivers and other communications hereunder shall be in writing by email and shall be deemed to have been given on the date sent by e-mail if send during normal business hours of the recipient, and on the next business day if sent after normal business hours of the recipient to the email address provided by the parties at the time hereof.`,
  },
  {
    title: "13. MISCELLANEOUS.",
    body: `This Agreement constitutes the sole and entire agreement of the Parties with respect to the subject matter hereof, and supersedes all other understandings and agreements with respect to such subject matter. If any term hereof is invalid or unenforceable, it shall not affect any other term or provision of this Agreement. Neither party may assign this Agreement without written consent of the other party. No waiver shall be deemed or implied hereunder.`,
  },
];

export default function NDAPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link href="/listings" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back to listings
        </Link>
      </div>

      <h1 className="font-serif text-3xl font-bold text-slate-900 mb-2">
        Non-Disclosure Agreement
      </h1>
      <p className="text-slate-500 text-sm mb-10">
        Effective as of the date of form submission on the Mercato platform
      </p>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        {/* Preamble */}
        <p className="text-sm text-slate-600 leading-relaxed mb-8">
          This Non-Disclosure Agreement (the &ldquo;Agreement&rdquo;), effective as of the date of form
          submission (the &ldquo;Effective Date&rdquo;), is entered into by and between the Disclosing
          Party (the &ldquo;Disclosing Party&rdquo;) and the named Company in the form submission (the
          &ldquo;Recipient&rdquo;, and together with the Disclosing Party, the &ldquo;Parties&rdquo;, and each, a
          &ldquo;Party&rdquo;). In connection with the consideration of a possible business for sale (the
          &ldquo;Purpose&rdquo;), the recipient desires to receive certain information from the Disclosing
          Party that is non-public, confidential, or proprietary in nature; and In consideration
          of the mutual covenants, terms and conditions set forth herein, the Parties agree as
          follows:
        </p>

        {/* Sections */}
        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-800 mb-2">
                {s.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center mt-8">
        Mercato · This agreement is governed by the laws of the State of Delaware.
      </p>
    </div>
  );
}
