"use server";

import { db } from "@/lib/db";

export async function listCourses({ query, publishedOnly = true }: { query?: string; publishedOnly?: boolean }) {
  return db.course.findMany({
    where: {
      published: publishedOnly ? true : undefined,
      OR: query
        ? [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } }
          ]
        : undefined
    },
    orderBy: { createdAt: "desc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: { materials: true }
      }
    }
  });
}

export async function getCourse(courseId: string) {
  return db.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: { orderBy: { order: "asc" }, include: { materials: true } }
    }
  });
}

export async function getCourseLessons(courseId: string) {
  return db.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    include: { materials: true }
  });
}
