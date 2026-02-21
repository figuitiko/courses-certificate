"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { setAdminMode } from "@/actions/users";
import { Button } from "@/components/ui/button";

export function AdminModeToggle({ enabled }: { enabled: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      variant={enabled ? "secondary" : "default"}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await setAdminMode(!enabled);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success(result.data.enabled ? "Admin mode enabled" : "Admin mode disabled");
          router.refresh();
        });
      }}
    >
      {pending ? "Updating..." : enabled ? "Disable admin mode" : "Enable admin mode"}
    </Button>
  );
}
