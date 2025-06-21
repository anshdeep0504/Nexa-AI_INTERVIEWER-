import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexa",
  description: "Nexa – Official AI Interview Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={`${monaSans.className} antialiased bg-gray-50 min-h-screen`}> 
        {/* Nexa Header */}
        <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              {/* If you have a logo, replace the text below with an <Image> */}
              <span className="text-2xl font-extrabold text-blue-700 tracking-tight">Nexa</span>
              <span className="ml-2 text-base font-semibold text-gray-500 tracking-wide">AI Interview Platform</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/interview" className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Start Practicing</Link>
            </div>
          </nav>
        </header>
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
