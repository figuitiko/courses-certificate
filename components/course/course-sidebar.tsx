"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type SidebarLesson = {
  id: string;
  title: string;
  order: number;
};

export function CourseSidebar({
  courseId,
  lessons,
  completedLessonIds
}: {
  courseId: string;
  lessons: SidebarLesson[];
  completedLessonIds: string[];
}) {
  const searchParams = useSearchParams();
  const activeLessonId = searchParams.get("lesson");
  const completed = new Set(completedLessonIds);

  return (
    <aside className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Lessons</h3>
      {lessons.map((lesson) => {
        const active = activeLessonId ? activeLessonId === lesson.id : lesson.order === 1;
        const done = completed.has(lesson.id);

        return (
          <Link
            key={lesson.id}
            href={`/learn/${courseId}?lesson=${lesson.id}`}
            className={cn(
              "flex items-center justify-between rounded-md border px-3 py-2 text-sm",
              active ? "border-primary bg-primary/10" : "hover:bg-muted"
            )}
          >
            <span>
              {lesson.order}. {lesson.title}
            </span>
            {done && <Badge variant="secondary">Done</Badge>}
          </Link>
        );
      })}
    </aside>
  );
}
