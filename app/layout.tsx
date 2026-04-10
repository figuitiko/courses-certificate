import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Manrope } from "next/font/google";

import "@/app/globals.css";
import { auth } from "@/lib/auth";
import { signOutUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

const headingFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Consulting Academy",
  description:
    "Inscríbete en cursos de consultoría, completa lecciones y gana puntos.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="es-MX">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <div className="page-shell">
          <header className="border-b border-white/60 bg-[rgba(255,250,244,0.84)] backdrop-blur-xl">
            <div className="container flex min-h-[4.75rem] flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-3">
              <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.24em] text-foreground/80 uppercase">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-lg font-semibold tracking-normal text-primary"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  CA
                </span>
                <span className="flex flex-col">
                  <span
                    className="text-lg font-semibold normal-case tracking-tight text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Consulting Academy
                  </span>
                  <span className="text-[0.68rem] text-muted-foreground">
                    Crecimiento práctico para consultores en México
                  </span>
                </span>
              </Link>
              <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/80">
              <Link href="/courses">Cursos</Link>
              <Link href="/my-courses">Mis cursos</Link>
              {session?.user ? (
                <>
                  <Link href="/profile">Perfil</Link>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin">Administración</Link>
                  )}
                  <form action={signOutUser}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 text-sm font-normal text-foreground/80"
                    >
                      Cerrar sesión
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/sign-in">Iniciar sesión</Link>
                  <Link href="/sign-up">Crear cuenta</Link>
                </>
              )}
              </nav>
            </div>
          </header>
          <main className="container">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
