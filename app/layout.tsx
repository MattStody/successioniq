import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-white">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} SuccessionIQ. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
