import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, SITE_HOST } from "@/lib/site";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "FairMark",
      url: SITE_URL,
      description:
        "FairMark is a free AI-powered business valuation tool and confidential marketplace for buying and selling businesses, built for owner-operators across Canada and the United States.",
      areaServed: ["Canada", "United States"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "FairMark",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

// Google Tag Manager. Overridable via NEXT_PUBLIC_GTM_ID; loaded only in
// production builds so local dev doesn't pollute analytics.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-MPMQ8S2J";
const analyticsEnabled = process.env.NODE_ENV === "production" && !!GTM_ID;

// Inter is the approved fallback for Satoshi (loaded from Fontshare in <head>).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "FairMark — The smarter way to buy or sell a business",
  description:
    "FairMark is the modern marketplace for buying, selling, and valuing businesses. Powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700&display=swap"
        />
        {analyticsEnabled && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
      </head>
      <body className="flex min-h-full flex-col bg-cream text-slate-900">
        {analyticsEnabled && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        )}
        <JsonLd data={orgJsonLd} />
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
              <Link href="/sell" className="hover:text-cream">Sell a Business</Link>
              <Link href="/for-buyers" className="hover:text-cream">For Buyers</Link>
              <Link href="/guides" className="hover:text-cream">Guides</Link>
              <Link href="/about" className="hover:text-cream">About</Link>
              <Link href="/privacy" className="hover:text-cream">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-cream">Terms</Link>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-cream/60">
              <span>
                © {new Date().getFullYear()} FairMark · Proudly built in Hamilton, Ontario 🇨🇦
              </span>
              <a href={SITE_URL} className="hover:text-cream">
                {SITE_HOST}
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
