"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { enrollInCourse } from "@/actions/enrollments";
import { Button } from "@/components/ui/button";

export function EnrollButton({
  isAuthenticated,
  courseId,
}: {
  isAuthenticated: boolean;
  courseId: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      disabled={pending}
      onClick={() => {
        if (!isAuthenticated) {
          toast.error("Primero inicia sesión para inscribirte.");
          return;
        }

        startTransition(async () => {
          const result = await enrollInCourse({ courseId });
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success("Inscripción completada.");
          router.push(`/learn/${courseId}`);
          router.refresh();
        });
      }}
    >
      {pending ? "Inscribiendo..." : "Inscribirme ahora"}
    </Button>
  );
}
