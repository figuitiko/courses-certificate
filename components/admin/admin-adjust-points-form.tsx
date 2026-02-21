"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { adjustUserPoints } from "@/actions/points";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminAdjustPointsForm({ userId }: { userId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="grid grid-cols-[120px_1fr_auto] gap-2"
      action={(formData) => {
        startTransition(async () => {
          const result = await adjustUserPoints({
            userId,
            points: Number(formData.get("points") || 0),
            note: String(formData.get("note") || "")
          });

          if (!result.ok) {
            toast.error(result.error);
            return;
          }

          toast.success("Points updated.");
          router.refresh();
        });
      }}
    >
      <Input type="number" name="points" placeholder="+25 or -10" required />
      <Input name="note" placeholder="Reason for adjustment" required />
      <Button type="submit" disabled={pending} size="sm">
        Apply
      </Button>
    </form>
  );
}
