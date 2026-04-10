"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { signUpWithCredentials } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUpForm() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="grid gap-4"
      action={(formData) => {
        startTransition(async () => {
          const result = await signUpWithCredentials({
            email: String(formData.get("email") || ""),
            name: String(formData.get("name") || ""),
            password: String(formData.get("password") || ""),
          });

          if (!result.ok) {
            toast.error(result.error);
            return;
          }

          toast.success("Cuenta creada. Inicia sesión para continuar.");
          router.push("/sign-in");
        });
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>

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
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
    </form>
  );
}
