import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "../components/auth/AuthContext";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/widgets/Footer";
import { QueryClientProvider } from "@tanstack/react-query";
import Providers from "@/providers/Providers";
import NavBar from "@/components/widgets/NavBar";

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
        <div className="pointer-events-none absolute -left-28 top-12 h-56 w-56 rounded-full bg-[#ffc9a7] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-24 h-64 w-64 rounded-full bg-[#9fd3ff] opacity-35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ffe8a3] opacity-45 blur-3xl" />
        <Providers>
          <NavBar className="absolute top-0 z-20 min-w-full" />
          {children}
          <Footer />
        </Providers>
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>

    </html>
  );
}
