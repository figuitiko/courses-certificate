import type { Metadata } from "next";
import Link from "next/link";

import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Consulting Academy",
  description: "Enroll in consulting courses, complete lessons, and earn points."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-card/70 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Consulting Academy
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/courses">Courses</Link>
              <Link href="/my-courses">My Courses</Link>
              <Link href="/profile">Profile</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
