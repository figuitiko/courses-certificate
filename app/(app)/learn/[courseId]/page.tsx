import Link from "next/link";
import { notFound } from "next/navigation";

import { getCourse } from "@/actions/courses";
import { getUserCourseState } from "@/actions/enrollments";
import { getCurrentUser } from "@/lib/session";
import { CourseSidebar } from "@/components/course/course-sidebar";
import { LessonPlayer } from "@/components/course/lesson-player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function LearnPage({
  params,
  searchParams
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const [{ courseId }, sp, user] = await Promise.all([params, searchParams, getCurrentUser()]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create your profile to start learning</CardTitle>
        </CardHeader>
        <CardContent>
          <Link className="text-primary underline" href="/profile">
            Go to profile
          </Link>
        </CardContent>
      </Card>
    );
  }

  const [course, state] = await Promise.all([getCourse(courseId), getUserCourseState({ userId: user.id, courseId })]);

  if (!course || !course.published) {
    notFound();
  }

  if (!state.enrollment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enroll first</CardTitle>
        </CardHeader>
        <CardContent>
          <Link className="text-primary underline" href={`/courses/${course.id}`}>
            Open course detail and enroll
          </Link>
        </CardContent>
      </Card>
    );
  }

  const selectedLesson =
    course.lessons.find((lesson) => lesson.id === sp.lesson) ||
    [...course.lessons].sort((a, b) => a.order - b.order)[0];

  if (!selectedLesson) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No lessons yet</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{course.title}</h1>
        <div className="mt-2 flex items-center gap-3">
          <Progress value={state.enrollment.progressPercent} className="max-w-sm" />
          <span className="text-sm text-muted-foreground">{Math.round(state.enrollment.progressPercent)}%</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
        <Card>
          <CardContent className="pt-6">
            <CourseSidebar courseId={courseId} lessons={course.lessons} completedLessonIds={state.completedLessonIds} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <LessonPlayer
              userId={user.id}
              courseId={courseId}
              lesson={selectedLesson}
              isCompleted={state.completedLessonIds.includes(selectedLesson.id)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
