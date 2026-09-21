import type { Metadata } from "next";
import { Roboto, Roboto_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/widgets/Footer";
import Providers from "@/providers/Providers";
import NavBar from "@/components/widgets/NavBar";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
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
      className={`${roboto.variable} ${robotoMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden font-sans" suppressHydrationWarning>
        <Providers>
          <NavBar className="absolute top-0 z-20 min-w-full" />
          {children}
          <Footer />
        </Providers>
        <Toaster position="bottom-right" richColors />
      </body>

    </html>
  );
}
