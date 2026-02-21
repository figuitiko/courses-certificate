"use server";

import {
  EnrollmentStatus,
  LessonProgressStatus,
  PointSourceType,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { DEFAULT_POINTS } from "@/lib/constants";
import { markLessonCompleteSchema } from "@/lib/zod/schemas";
import { awardPointsOnce } from "@/actions/points";
import { toPercent } from "@/lib/utils";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/lib/action-result";

export async function markLessonComplete(input: {
  courseId: string;
  lessonId: string;
}): Promise<
  ActionResult<{ progressPercent: number; completedCourse: boolean }>
> {
  const user = await requireUser();

  const parsed = markLessonCompleteSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid completion request.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { courseId, lessonId } = parsed.data;

  const [lesson, course] = await Promise.all([
    db.lesson.findUnique({ where: { id: lessonId } }),
    db.course.findUnique({ where: { id: courseId } }),
  ]);

  if (!lesson || lesson.courseId !== courseId || !course) {
    return { ok: false, error: "Lesson or course not found." };
  }

  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: {
      status: LessonProgressStatus.COMPLETED,
      completedAt: new Date(),
      courseId,
    },
    create: {
      userId: user.id,
      lessonId,
      courseId,
      status: LessonProgressStatus.COMPLETED,
      completedAt: new Date(),
    },
  });

  await awardPointsOnce({
    userId: user.id,
    sourceType: PointSourceType.LESSON_COMPLETE,
    sourceId: lessonId,
    points: lesson.pointsOnComplete ?? DEFAULT_POINTS.lessonComplete,
    note: `Completed lesson: ${lesson.title}`,
  });

  const [totalLessons, completedLessons] = await Promise.all([
    db.lesson.count({ where: { courseId } }),
    db.lessonProgress.count({
      where: {
        userId: user.id,
        courseId,
        status: LessonProgressStatus.COMPLETED,
      },
    }),
  ]);

  const progressPercent = toPercent(completedLessons, totalLessons);

  await db.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId } },
    update: { progressPercent },
    create: {
      userId: user.id,
      courseId,
      progressPercent,
      status: EnrollmentStatus.ENROLLED,
    },
  });

  let completedCourse = false;

  if (totalLessons > 0 && completedLessons >= totalLessons) {
    completedCourse = true;

    await db.enrollment.update({
      where: { userId_courseId: { userId: user.id, courseId } },
      data: {
        status: EnrollmentStatus.COMPLETED,
        progressPercent: 100,
      },
    });

    await awardPointsOnce({
      userId: user.id,
      sourceType: PointSourceType.COURSE_COMPLETE,
      sourceId: courseId,
      points: course.pointsOnComplete ?? DEFAULT_POINTS.courseComplete,
      note: `Completed course: ${course.title}`,
    });
  }

  revalidatePath(`/learn/${courseId}`);
  revalidatePath("/my-courses");
  revalidatePath("/profile");

  return {
    ok: true,
    data: {
      progressPercent,
      completedCourse,
    },
  };
}
