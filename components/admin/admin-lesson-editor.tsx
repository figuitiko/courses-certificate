"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { reorderLessons, updateLesson } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Lesson = {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  order: number;
  pointsOnComplete: number | null;
};

export function AdminLessonEditor({ lesson, orderedLessonIds, courseId }: { lesson: Lesson; orderedLessonIds: string[]; courseId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const index = orderedLessonIds.indexOf(lesson.id);

  return (
    <div className="space-y-2">
      <form
        className="grid gap-2"
        action={(formData) => {
          startTransition(async () => {
            const result = await updateLesson(lesson.id, {
              courseId,
              title: String(formData.get("title") || ""),
              content: String(formData.get("content") || ""),
              videoUrl: String(formData.get("videoUrl") || ""),
              order: Number(formData.get("order") || lesson.order),
              pointsOnComplete: Number(formData.get("pointsOnComplete") || 10)
            });

            if (!result.ok) {
              toast.error(result.error);
              return;
            }

            toast.success("Lesson updated.");
            router.refresh();
          });
        }}
      >
        <Input name="title" defaultValue={lesson.title} required />
        <Input name="videoUrl" defaultValue={lesson.videoUrl ?? ""} placeholder="Video URL" />
        <Input name="content" defaultValue={lesson.content ?? ""} placeholder="Content" />
        <div className="grid grid-cols-2 gap-2">
          <Input name="order" defaultValue={lesson.order} type="number" min={1} />
          <Input name="pointsOnComplete" defaultValue={lesson.pointsOnComplete ?? 10} type="number" min={0} />
        </div>
        <Button size="sm" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save lesson"}
        </Button>
      </form>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={pending || index <= 0}
          onClick={() => {
            const next = [...orderedLessonIds];
            [next[index - 1], next[index]] = [next[index], next[index - 1]];
            startTransition(async () => {
              const result = await reorderLessons(courseId, next);
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success("Lesson moved up.");
              router.refresh();
            });
          }}
        >
          Move up
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={pending || index < 0 || index >= orderedLessonIds.length - 1}
          onClick={() => {
            const next = [...orderedLessonIds];
            [next[index], next[index + 1]] = [next[index + 1], next[index]];
            startTransition(async () => {
              const result = await reorderLessons(courseId, next);
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success("Lesson moved down.");
              router.refresh();
            });
          }}
        >
          Move down
        </Button>
      </div>
    </div>
  );
}
