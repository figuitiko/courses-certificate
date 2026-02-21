"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { signInWithCredentials } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm({ nextPath = "/courses" }: { nextPath?: string }) {
  const [pending, startTransition] = useTransition();

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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
