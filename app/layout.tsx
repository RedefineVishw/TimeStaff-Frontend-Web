import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TimeStaff",
  description: "Local-first time tracking for projects and tasks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
            <Image src="/logo.svg" alt="TimeStaff" width={140} height={28} priority />
            <nav className="flex gap-4 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/time-entries" className="hover:text-gray-900">
                Time Entries
              </Link>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
