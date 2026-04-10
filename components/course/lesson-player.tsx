"use client";

import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { markLessonComplete } from "@/actions/progress";
import { Button } from "@/components/ui/button";

type Material = {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
};

type LessonPlayerProps = {
  courseId: string;
  lesson: {
    id: string;
    title: string;
    content: string | null;
    videoUrl: string | null;
    materials: Material[];
  };
  isCompleted: boolean;
};

export function LessonPlayer({
  courseId,
  lesson,
  isCompleted,
}: LessonPlayerProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const embeddedVideoUrl = useMemo(() => {
    if (!lesson.videoUrl) return null;
    return lesson.videoUrl;
  }, [lesson.videoUrl]);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">{lesson.title}</h2>
        {lesson.content && (
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {lesson.content}
          </p>
        )}
      </div>

      {embeddedVideoUrl ? (
        <div className="overflow-hidden rounded-lg border bg-black/90">
          <iframe
            title={lesson.title}
            className="aspect-video w-full"
            src={embeddedVideoUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          No se proporcionó una URL de video.
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-medium">Materiales descargables</h3>
        {lesson.materials.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay materiales para esta lección.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {lesson.materials.map((material) => (
              <li key={material.id}>
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  {material.title} ({material.fileType})
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button
        onClick={() => {
          startTransition(async () => {
            const result = await markLessonComplete({
              courseId,
              lessonId: lesson.id,
            });

            if (!result.ok) {
              toast.error(result.error);
              return;
            }

            toast.success(
              result.data.completedCourse
                ? "Lección completada. Curso terminado."
                : "Lección marcada como completada.",
            );
            router.refresh();
          });
        }}
        disabled={pending || isCompleted}
      >
        {isCompleted
          ? "Ya completada"
          : pending
            ? "Guardando..."
            : "Marcar como completada"}
      </Button>
    </section>
  );
}
