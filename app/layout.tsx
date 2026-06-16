import type { Metadata } from "next";
import { Hanken_Grotesk, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Nav from "@/components/Nav";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SuccessionIQ — Business Succession Marketplace",
  description:
    "The intelligent marketplace for buying, selling, and valuing businesses. Powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-slate-900">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="bg-navy text-cream/80">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <p className="mb-6 max-w-md text-lg font-semibold text-cream">
              The modern succession platform for business owners who built something real.
            </p>
            <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/how-it-works" className="hover:text-cream">How It Works</Link>
              <Link href="/for-sellers" className="hover:text-cream">For Sellers</Link>
              <Link href="/for-buyers" className="hover:text-cream">For Buyers</Link>
              <Link href="/about" className="hover:text-cream">About</Link>
              <Link href="/privacy" className="hover:text-cream">Privacy Policy</Link>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-cream/60">
              <span>
                © {new Date().getFullYear()} SuccessionIQ · Proudly built in Hamilton, Ontario 🇨🇦
              </span>
              <a href="https://successioniq.vercel.app" className="hover:text-cream">
                successioniq.vercel.app
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
