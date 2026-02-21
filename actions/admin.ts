"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { courseSchema, lessonSchema, materialSchema } from "@/lib/zod/schemas";
import type { ActionResult } from "@/lib/action-result";

export async function createCourse(input: {
  title: string;
  description: string;
  thumbnailUrl?: string;
  published?: boolean;
  pointsOnEnroll: number;
  pointsOnComplete: number;
}): Promise<ActionResult<{ courseId: string }>> {
  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid course input.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const course = await db.course.create({ data: { ...parsed.data, thumbnailUrl: parsed.data.thumbnailUrl || null } });
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { ok: true, data: { courseId: course.id } };
}

export async function updateCourse(courseId: string, input: {
  title: string;
  description: string;
  thumbnailUrl?: string;
  published?: boolean;
  pointsOnEnroll: number;
  pointsOnComplete: number;
}): Promise<ActionResult<{ courseId: string }>> {
  const parsed = courseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid course input.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  await db.course.update({
    where: { id: courseId },
    data: { ...parsed.data, thumbnailUrl: parsed.data.thumbnailUrl || null }
  });

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/courses");
  return { ok: true, data: { courseId } };
}

export async function publishCourse(courseId: string, published: boolean): Promise<ActionResult<{ courseId: string }>> {
  await db.course.update({ where: { id: courseId }, data: { published } });
  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/admin/courses/${courseId}`);
  return { ok: true, data: { courseId } };
}

export async function createLesson(input: {
  courseId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  order: number;
  pointsOnComplete?: number;
}): Promise<ActionResult<{ lessonId: string }>> {
  const parsed = lessonSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid lesson input.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const lesson = await db.lesson.create({
    data: {
      ...parsed.data,
      content: parsed.data.content || null,
      videoUrl: parsed.data.videoUrl || null
    }
  });

  revalidatePath(`/admin/courses/${parsed.data.courseId}`);
  revalidatePath(`/courses/${parsed.data.courseId}`);
  return { ok: true, data: { lessonId: lesson.id } };
}

export async function updateLesson(
  lessonId: string,
  input: {
    courseId: string;
    title: string;
    content?: string;
    videoUrl?: string;
    order: number;
    pointsOnComplete?: number;
  }
): Promise<ActionResult<{ lessonId: string }>> {
  const parsed = lessonSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid lesson input.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  await db.lesson.update({
    where: { id: lessonId },
    data: {
      ...parsed.data,
      content: parsed.data.content || null,
      videoUrl: parsed.data.videoUrl || null
    }
  });

  revalidatePath(`/admin/courses/${parsed.data.courseId}`);
  revalidatePath(`/learn/${parsed.data.courseId}`);
  return { ok: true, data: { lessonId } };
}

export async function reorderLessons(courseId: string, orderedLessonIds: string[]): Promise<ActionResult<null>> {
  await db.$transaction(
    orderedLessonIds.map((lessonId, index) =>
      db.lesson.update({
        where: { id: lessonId },
        data: { order: index + 1 }
      })
    )
  );

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/learn/${courseId}`);
  return { ok: true, data: null };
}

export async function addMaterial(input: {
  lessonId: string;
  title: string;
  fileUrl: string;
  fileType: string;
}): Promise<ActionResult<{ materialId: string }>> {
  const parsed = materialSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid material input.",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }

  const material = await db.material.create({ data: parsed.data });
  const lesson = await db.lesson.findUnique({ where: { id: parsed.data.lessonId }, select: { courseId: true } });

  if (lesson) {
    revalidatePath(`/admin/courses/${lesson.courseId}`);
    revalidatePath(`/learn/${lesson.courseId}`);
  }

  return { ok: true, data: { materialId: material.id } };
}

export async function removeMaterial(materialId: string): Promise<ActionResult<null>> {
  const material = await db.material.findUnique({
    where: { id: materialId },
    include: { lesson: { select: { courseId: true } } }
  });

  if (!material) {
    return { ok: false, error: "Material not found." };
  }

  await db.material.delete({ where: { id: materialId } });

  revalidatePath(`/admin/courses/${material.lesson.courseId}`);
  revalidatePath(`/learn/${material.lesson.courseId}`);
  return { ok: true, data: null };
}
