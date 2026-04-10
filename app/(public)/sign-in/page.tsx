import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { signInWithGoogle } from "@/actions/auth";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );
  const nextPath =
    params.next && params.next.startsWith("/") ? params.next : "/courses";
  const oauthErrorMessage =
    params.error === "OAuthAccountNotLinked"
      ? "Este correo ya usa acceso con contraseña. Inicia sesión con tu contraseña primero y después conecta Google desde Perfil."
      : undefined;

  if (session?.user) {
    redirect(nextPath as never);
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>
          Usa tu correo y contraseña o continúa con Google.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignInForm nextPath={nextPath} oauthErrorMessage={oauthErrorMessage} />
        {googleEnabled && (
          <form action={signInWithGoogle.bind(null, nextPath)}>
            <Button type="submit" variant="outline" className="w-full">
              Continuar con Google
            </Button>
          </form>
        )}
        <p className="text-sm text-muted-foreground">
          ¿Todavía no tienes cuenta?{" "}
          <Link href="/sign-up" className="text-primary underline">
            Crear una
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
