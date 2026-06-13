import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "../components/auth/AuthContext";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/widgets/Footer";
import { QueryClientProvider } from "@tanstack/react-query";
import Providers from "@/providers/Providers";

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
        <Providers>
          <header className="sticky top-0 z-20 border-b border-black/10 bg-white shadow-sm">
          </header>
          {children}
          <Footer />
        </Providers>
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>

    </html>
  );
}
