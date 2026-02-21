"use server";

import { EnrollmentStatus, PointSourceType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { DEFAULT_POINTS } from "@/lib/constants";
import { enrollSchema } from "@/lib/zod/schemas";
import { awardPointsOnce } from "@/actions/points";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/lib/action-result";

export async function enrollInCourse(input: {
  courseId: string;
}): Promise<ActionResult<{ enrollmentId: string }>> {
  const user = await requireUser();
  const parsed = enrollSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid enroll request.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const [course, enrollment] = await db.$transaction([
      db.course.findUnique({ where: { id: parsed.data.courseId } }),
      db.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: parsed.data.courseId,
          },
        },
        create: {
          userId: user.id,
          courseId: parsed.data.courseId,
          status: EnrollmentStatus.ENROLLED,
        },
        update: {},
      }),
    ]);

    if (!course) {
      return { ok: false, error: "Course not found." };
    }

    await awardPointsOnce({
      userId: user.id,
      sourceType: PointSourceType.COURSE_ENROLL,
      sourceId: parsed.data.courseId,
      points: course.pointsOnEnroll ?? DEFAULT_POINTS.enroll,
      note: `Enrolled in ${course.title}`,
    });

    revalidatePath(`/learn/${parsed.data.courseId}`);
    revalidatePath("/my-courses");
    revalidatePath("/profile");

    return { ok: true, data: { enrollmentId: enrollment.id } };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { ok: false, error: "Unable to enroll in this course." };
    }
    return { ok: false, error: "Unexpected error while enrolling." };
  }
}

export async function getUserCourseState({ courseId }: { courseId: string }) {
  const user = await requireUser();

  const [enrollment, progress] = await Promise.all([
    db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    }),
    db.lessonProgress.findMany({
      where: { userId: user.id, courseId, status: "COMPLETED" },
      select: { lessonId: true },
    }),
  ]);

  return {
    enrollment,
    completedLessonIds: progress.map((item) => item.lessonId),
  };
}
