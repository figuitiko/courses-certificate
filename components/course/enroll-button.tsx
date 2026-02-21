"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { enrollInCourse } from "@/actions/enrollments";
import { Button } from "@/components/ui/button";

export function EnrollButton({ userId, courseId }: { userId?: string; courseId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      disabled={!userId || pending}
      onClick={() => {
        if (!userId) {
          toast.error("Create your profile handle first from Profile page.");
          return;
        }

        startTransition(async () => {
          const result = await enrollInCourse({ userId, courseId });
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success("Enrolled successfully.");
          router.push(`/learn/${courseId}`);
          router.refresh();
        });
      }}
    >
      {pending ? "Enrolling..." : "Enroll now"}
    </Button>
  );
}
