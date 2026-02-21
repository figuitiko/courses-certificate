import { z } from "zod";

export const userProfileSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  name: z.string().min(2).max(80).optional().or(z.literal("")),
  handle: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9_-]+$/i, "Use letters, numbers, dash, or underscore only"),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(2).max(80),
  password: z.string().min(8).max(128),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  nextPath: z.string().optional().default("/courses"),
});

export const enrollSchema = z.object({
  courseId: z.string().min(1),
});

export const markLessonCompleteSchema = z.object({
  courseId: z.string().min(1),
  lessonId: z.string().min(1),
});

export const courseSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(4000),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().optional().default(false),
  pointsOnEnroll: z.coerce.number().int().min(0).max(500),
  pointsOnComplete: z.coerce.number().int().min(0).max(2000),
});

export const lessonSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(3).max(120),
  content: z.string().trim().max(8000).optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),
  order: z.coerce.number().int().min(1),
  pointsOnComplete: z.coerce.number().int().min(0).max(500).optional(),
});

export const materialSchema = z.object({
  lessonId: z.string().min(1),
  title: z.string().trim().min(2).max(120),
  fileUrl: z.string().url(),
  fileType: z.string().trim().min(2).max(40),
});

export const pointsAdjustSchema = z.object({
  userId: z.string().min(1),
  points: z.coerce.number().int().min(-5000).max(5000),
  note: z.string().trim().min(2).max(160),
});
