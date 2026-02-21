import { notFound } from "next/navigation";

import { getCourse } from "@/actions/courses";
import { getCurrentUser } from "@/lib/session";
import { EnrollButton } from "@/components/course/enroll-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const [{ courseId }, user] = await Promise.all([params, getCurrentUser()]);
  const course = await getCourse(courseId);

  if (!course || !course.published) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold">{course.title}</h1>
        <p className="max-w-3xl text-muted-foreground">{course.description}</p>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>{course.lessons.length} lessons</span>
          <span>{course.pointsOnEnroll} points on enroll</span>
          <span>{course.pointsOnComplete} points on completion</span>
        </div>
        <EnrollButton userId={user?.id} courseId={course.id} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Lesson outline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {course.lessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">No lessons available yet.</p>
          ) : (
            course.lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-md border p-3">
                <p className="font-medium">
                  {lesson.order}. {lesson.title}
                </p>
                {lesson.content && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{lesson.content}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
