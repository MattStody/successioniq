import Link from "next/link";

/**
 * The single conversion CTA used across every marketing page. Defaults to the
 * free-valuation tool and the canonical label so copy stays consistent.
 */
export default function CTAButton({
  href = "/valuate",
  children = "Get My Free Valuation →",
  className = "",
  variant = "default",
}: {
  href?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "onDark";
}) {
  const styles =
    variant === "onDark"
      ? "bg-white text-navy hover:bg-blue-50"
      : "bg-accent text-white hover:bg-accent-dark";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-xl px-7 py-4 text-base font-bold shadow-md transition-all hover:-translate-y-0.5 ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}
