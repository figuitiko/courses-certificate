"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { addMaterial, removeMaterial } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminMaterialForm({ lessonId }: { lessonId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="grid grid-cols-[2fr_2fr_1fr_auto] gap-2"
      action={(formData) => {
        startTransition(async () => {
          const result = await addMaterial({
            lessonId,
            title: String(formData.get("title") || ""),
            fileUrl: String(formData.get("fileUrl") || ""),
            fileType: String(formData.get("fileType") || "pdf")
          });

          if (!result.ok) {
            toast.error(result.error);
            return;
          }

          toast.success("Material added.");
          router.refresh();
        });
      }}
    >
      <Input name="title" placeholder="Material title" required />
      <Input name="fileUrl" placeholder="https://..." required />
      <Input name="fileType" placeholder="pdf" required />
      <Button type="submit" disabled={pending} size="sm">
        Add
      </Button>
    </form>
  );
}

export function RemoveMaterialButton({ materialId }: { materialId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await removeMaterial(materialId);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success("Material removed.");
          router.refresh();
        });
      }}
    >
      Remove
    </Button>
  );
}
