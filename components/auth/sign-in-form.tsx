"use client";

import { useEffect, useTransition } from "react";
import { toast } from "sonner";

import { signInWithCredentials } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm({
  nextPath = "/courses",
  oauthErrorMessage,
}: {
  nextPath?: string;
  oauthErrorMessage?: string;
}) {
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (oauthErrorMessage) {
      toast.error(oauthErrorMessage);
    }
  }, [oauthErrorMessage]);

  return (
    <form
      className="grid gap-4"
      action={(formData) => {
        startTransition(async () => {
          const result = await signInWithCredentials({
            email: String(formData.get("email") || ""),
            password: String(formData.get("password") || ""),
            nextPath,
          });

          if (!result.ok) {
            toast.error(result.error);
            return;
          }

          window.location.assign(result.data.redirectTo);
        });
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
