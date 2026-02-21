"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createLesson } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLessonForm({ courseId, nextOrder }: { courseId: string; nextOrder: number }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="grid gap-3"
      action={(formData) => {
        startTransition(async () => {
          const result = await createLesson({
            courseId,
            title: String(formData.get("title") || ""),
            content: String(formData.get("content") || ""),
            videoUrl: String(formData.get("videoUrl") || ""),
            order: Number(formData.get("order") || nextOrder),
            pointsOnComplete: Number(formData.get("pointsOnComplete") || 10)
          });

          if (!result.ok) {
            toast.error(result.error);
            return;
          }

          toast.success("Lesson created.");
          router.refresh();
        });
      }}
    >
      <Input name="title" placeholder="Lesson title" required />
      <Input name="videoUrl" placeholder="Video URL (YouTube embed etc.)" />
      <Input name="content" placeholder="Optional lesson notes" />
      <div className="grid grid-cols-2 gap-3">
        <Input name="order" type="number" min={1} defaultValue={nextOrder} />
        <Input name="pointsOnComplete" type="number" min={0} defaultValue={10} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Adding..." : "Add lesson"}
      </Button>
    </form>
  );
}
