import Link from "next/link";

export default function Nav() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">
            Succession
            <span className="text-indigo-400">IQ</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <Link href="/listings" className="hover:text-white transition-colors">
            Browse Listings
          </Link>
          <Link href="/valuate" className="hover:text-white transition-colors">
            Valuate
          </Link>
          <Link
            href="/valuate"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Get Valuation
          </Link>
        </div>
      </div>
    </nav>
  );
}
