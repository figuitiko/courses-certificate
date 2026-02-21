import type { Metadata } from "next";
import Link from "next/link";

import "@/app/globals.css";
import { auth } from "@/lib/auth";
import { signOutUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Consulting Academy",
  description:
    "Enroll in consulting courses, complete lessons, and earn points.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

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
              {session?.user ? (
                <>
                  <Link href="/profile">Profile</Link>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin">Admin</Link>
                  )}
                  <form action={signOutUser}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 text-sm font-normal"
                    >
                      Sign out
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/sign-in">Sign in</Link>
                  <Link href="/sign-up">Sign up</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
