"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createOrGetUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="grid gap-4"
      action={(formData) => {
        startTransition(async () => {
          const result = await createOrGetUser({
            handle: String(formData.get("handle") || ""),
            name: String(formData.get("name") || ""),
            email: String(formData.get("email") || "")
          });

          if (!result.ok) {
            toast.error(result.error);
            return;
          }

          toast.success("Profile ready.");
          router.refresh();
        });
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="handle">Handle</Label>
        <Input id="handle" name="handle" placeholder="consultant_amy" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="name">Name (optional)</Label>
        <Input id="name" name="name" placeholder="Amy" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Create profile"}
      </Button>
    </form>
  );
}
