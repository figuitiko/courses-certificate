import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { SignUpForm } from "@/components/auth/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignUpPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/courses");
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>
          Configura tu cuenta para inscribirte y dar seguimiento a tu avance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignUpForm />
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/sign-in" className="text-primary underline">
            Iniciar sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
