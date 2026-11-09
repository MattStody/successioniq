import type { Metadata } from "next";
import Link from "next/link";
import Prose from "@/components/guides/Prose";

export const metadata: Metadata = {
  title: "Privacy Policy — Mercato",
  description:
    "How Mercato collects, uses, and protects your information — including the business details you enter for a valuation.",
};

// Set this to the date the policy actually takes effect once reviewed.
const LAST_UPDATED = "November 9, 2026";

export default function PrivacyPage() {
  return (
    <div className="bg-white text-[#0E1330]">
      {/* Header */}
      <header className="border-b border-[#E3E8F3] bg-[#F4F6FC]">
        <div className="mx-auto max-w-[760px] px-5 pb-12 pt-12 sm:px-8 lg:pt-16">
          <h1 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[44px]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-[#525C7A]">Last updated: {LAST_UPDATED}</p>
          <p className="mt-6 text-lg leading-normal text-[#3B4566]">
            Your information stays yours. We never sell your data, and your valuation is
            private until you choose to share it or list your business. This page explains
            what we collect, how we use it, and the control you have.
          </p>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-[760px] px-5 py-14 sm:px-8 lg:py-16">
        <Prose>
          <p>
            This Privacy Policy describes how Mercato, operated by{" "}
            <strong>Boldly Media Inc.</strong> (&ldquo;Mercato,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;), collects, uses, discloses, and protects
            personal information when you use our website and services (the
            &ldquo;Service&rdquo;). We are based in Hamilton, Ontario, Canada, and serve
            business owners and buyers in Canada and the United States.
          </p>
          <p>
            By using the Service, you agree to the collection and use of information in
            accordance with this policy.
          </p>

          <h2>1. Information we collect</h2>
          <h3>Information you provide</h3>
          <ul>
            <li>
              <strong>Valuation details.</strong> The business information you enter to
              generate a valuation — for example industry, country and region, annual
              revenue, annual profit, years in operation, revenue trend, customer
              concentration, and reason for selling.
            </li>
            <li>
              <strong>Contact details.</strong> The email address you provide to receive your
              valuation or report, and your name and email if you sign a non-disclosure
              agreement (NDA) to request seller contact information.
            </li>
            <li>
              <strong>Account information.</strong> If you create an account, your name,
              email address, role (seller, buyer, or broker), and optionally a phone number.
              Authentication is handled by our provider; we do not store your password.
            </li>
            <li>
              <strong>Listing information.</strong> If you list a business, the financial and
              descriptive details you choose to include, and seller contact details, which are
              only revealed to a buyer after they sign an NDA.
            </li>
            <li>
              <strong>Communications.</strong> Any messages you send us.
            </li>
          </ul>
          <h3>Information collected automatically</h3>
          <ul>
            <li>
              <strong>Usage and device data.</strong> Basic technical information such as IP
              address, browser type, and pages visited, used to operate and secure the
              Service (including rate-limiting to prevent abuse).
            </li>
            <li>
              <strong>Cookies and local storage.</strong> We use strictly necessary cookies to
              keep you signed in, and limited browser storage to remember conveniences such as
              an email you entered or a listing you started. See &ldquo;Cookies&rdquo; below.
            </li>
          </ul>

          <h2>2. How we use your information</h2>
          <ul>
            <li>To generate your business valuation and deliver your results and report.</li>
            <li>To operate the marketplace — publishing your listing, matching buyers and sellers, and processing NDA requests — if you choose to use it.</li>
            <li>To create and manage your account and authenticate you.</li>
            <li>To communicate with you about your valuation, account, or a listing, and, where permitted, to send you related updates you can opt out of at any time.</li>
            <li>To maintain the security, integrity, and performance of the Service and to prevent fraud or abuse.</li>
            <li>To comply with legal obligations.</li>
          </ul>
          <p>
            <strong>We do not sell your personal information.</strong>
          </p>

          <h2>3. AI processing and service providers</h2>
          <p>
            To generate valuations, the business details you enter are sent to our AI
            provider, <strong>Anthropic</strong> (the Claude API), which processes them to
            return a valuation range and analysis. We also rely on trusted providers to run
            the Service, including <strong>Supabase</strong> (database and authentication) and{" "}
            <strong>Vercel</strong> (hosting). These providers process information on our
            behalf under their own terms and security practices, and only as needed to provide
            their services to us.
          </p>
          <p>
            Because these providers may operate in the United States, your information may be
            processed or stored outside your province or country. See &ldquo;International
            transfers&rdquo; below.
          </p>

          <h2>4. When we share information</h2>
          <p>We share personal information only in these limited circumstances:</p>
          <ul>
            <li>
              <strong>With your direction.</strong> When you list a business, your listing
              details become visible to buyers; and when a buyer signs an NDA for your
              listing, your designated contact details are revealed to that buyer.
            </li>
            <li>
              <strong>With service providers</strong> who process information on our behalf, as
              described above.
            </li>
            <li>
              <strong>For legal reasons</strong> — to comply with applicable law, respond to
              lawful requests, or protect the rights, safety, and property of Mercato, our
              users, or others.
            </li>
            <li>
              <strong>In a business transfer</strong> — if Mercato is involved in a merger,
              acquisition, or sale of assets, subject to this policy.
            </li>
          </ul>

          <h2>5. Email and marketing communications</h2>
          <p>
            We send transactional messages related to your valuation, account, and listings.
            Where we send commercial electronic messages, we do so in accordance with
            applicable anti-spam laws, including Canada&apos;s Anti-Spam Legislation (CASL). You
            can withdraw consent or unsubscribe at any time using the link in our emails or by
            contacting us, and we will stop sending commercial messages.
          </p>

          <h2>6. Data retention</h2>
          <p>
            We keep personal information only as long as needed for the purposes described in
            this policy, to provide the Service, and to meet legal, accounting, or reporting
            requirements. You may ask us to delete your information as described below.
          </p>

          <h2>7. How we protect your information</h2>
          <p>
            We use administrative and technical safeguards — including encryption in transit,
            access controls, and database-level security rules — to protect your information.
            No method of transmission or storage is completely secure, so we cannot guarantee
            absolute security.
          </p>

          <h2>8. Your rights and choices</h2>
          <p>
            Subject to applicable law, you may request to access, correct, update, or delete
            your personal information, and withdraw consent to certain processing. Residents of
            certain jurisdictions (for example, under Canada&apos;s PIPEDA or applicable U.S.
            state privacy laws) may have additional rights. To exercise any of these, contact
            us at <strong>matt@boldlymedia.com</strong>. We will respond within the time
            required by applicable law.
          </p>

          <h2>9. International transfers</h2>
          <p>
            Mercato is operated from Canada, and our service providers may process information
            in the United States and elsewhere. Where required, we take steps to ensure your
            information receives appropriate protection when transferred across borders.
          </p>

          <h2>10. Children&apos;s privacy</h2>
          <p>
            The Service is intended for business owners and buyers and is not directed to
            individuals under 18. We do not knowingly collect personal information from
            children.
          </p>

          <h2>11. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will revise the
            &ldquo;Last updated&rdquo; date above and, where appropriate, provide additional
            notice. Your continued use of the Service after changes take effect means you
            accept the updated policy.
          </p>

          <h2>12. Contact us</h2>
          <p>
            Questions or requests about your privacy? Contact our privacy contact at{" "}
            <strong>matt@boldlymedia.com</strong>, or write to us at{" "}
            <strong>
              Boldly Media Inc., 800 Paramount Drive, Unit 47, Stoney Creek, Ontario, Canada
            </strong>
            .
          </p>
          <p>
            See also our{" "}
            <Link href="/terms">Terms of Service</Link>.
          </p>
        </Prose>

        <p className="mt-12 rounded-2xl border border-[#DCE3F2] bg-[#F4F6FC] p-5 text-sm leading-relaxed text-[#525C7A]">
          This policy is a starting template provided for convenience and is not legal advice.
          Replace the bracketed placeholders and have it reviewed by qualified legal counsel
          in your jurisdiction before relying on it.
        </p>
      </div>
    </div>
  );
}
