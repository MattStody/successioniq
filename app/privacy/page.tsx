export const metadata = {
  title: "Privacy Policy — Mercato",
  description: "How Mercato handles your information. Short version: it stays yours.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight text-navy">Privacy Policy</h1>
        <p className="mt-4 text-navy/60">Last updated {new Date().getFullYear()}</p>

        <div className="mt-10 space-y-8 leading-relaxed text-navy/75">
          <div>
            <h2 className="text-xl font-semibold text-navy">The short version</h2>
            <p className="mt-3">
              Your information stays yours. We never sell your data, and your valuation is
              private until you choose to share it or list your business. You&apos;re in control
              of every step.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-navy">What we collect</h2>
            <p className="mt-3">
              The details you enter to generate a valuation (industry, location, and high-level
              financials), the email address you choose to provide, and basic account
              information if you create an account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-navy">How we use it</h2>
            <p className="mt-3">
              To generate your valuation, to operate the marketplace if you choose to list, and
              to contact you about your account. We do not sell your information to third
              parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-navy">Your control</h2>
            <p className="mt-3">
              You can request that we delete your data at any time. Listings are only visible
              once you publish them, and you can remove a listing whenever you like.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-navy">Contact</h2>
            <p className="mt-3">
              Questions about your privacy? Reach out and a real person will get back to you.
            </p>
          </div>
        </div>

        <p className="mt-12 text-sm text-navy/50">
          This page is a plain-language summary and not a substitute for formal legal terms.
          Replace with counsel-reviewed policy before launch.
        </p>
      </div>
    </div>
  );
}
