import Link from "next/link";

/**
 * The single conversion CTA used across every marketing page. Defaults to the
 * free-valuation tool and the canonical label so copy stays consistent.
 */
export default function CTAButton({
  href = "/valuate",
  children = "Get My Free Valuation →",
  className = "",
}: {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-xl bg-accent px-7 py-4 text-base font-bold text-navy shadow-md transition-all hover:bg-accent-dark hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </Link>
  );
}
