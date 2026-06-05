import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "../components/auth/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventX",
  description: "EventX helps teams plan, launch, and run unforgettable events.",
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
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <header className="sticky top-0 z-20 border-b border-black/10 bg-white shadow-sm">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
              <Link className="flex items-center gap-3" href="/">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black text-xs font-semibold uppercase tracking-widest text-white">
                  EX
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-black">
                  EventX
                </span>
              </Link>
              <Link
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white text-sm font-semibold text-black transition hover:border-black/40"
                href="/event-dashboard"
                aria-label="Go to dashboard"
              >
                DB
              </Link>
            </div>
          </header>
          {children}
        </AuthProvider>
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>

    </html>
  );
}
