import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { isAdminModeEnabled } from "@/lib/auth";
import { AdminCourseForm } from "@/components/admin/admin-course-form";
import { AdminLessonForm } from "@/components/admin/admin-lesson-form";
import { AdminMaterialForm, RemoveMaterialButton } from "@/components/admin/admin-material-form";
import { AdminLessonEditor } from "@/components/admin/admin-lesson-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminCourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const adminEnabled = await isAdminModeEnabled();
  if (!adminEnabled) {
    return <p className="rounded-md border border-dashed p-6 text-center text-muted-foreground">Admin mode is disabled.</p>;
  }

  const { courseId } = await params;
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: { materials: true }
      }
    }
  });

  if (!course) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Edit Course</h1>
      <Card>
        <CardHeader>
          <CardTitle>Course settings</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminCourseForm defaults={course} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminLessonForm courseId={course.id} nextOrder={course.lessons.length + 1} />
        </CardContent>
      </Card>

      {course.lessons.map((lesson) => (
        <Card key={lesson.id}>
          <CardHeader>
            <CardTitle>
              {lesson.order}. {lesson.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AdminLessonEditor lesson={lesson} orderedLessonIds={course.lessons.map((item) => item.id)} courseId={course.id} />
            <AdminMaterialForm lessonId={lesson.id} />
            <div className="space-y-2">
              {lesson.materials.length === 0 ? (
                <p className="text-sm text-muted-foreground">No materials yet.</p>
              ) : (
                lesson.materials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                    <span>
                      {material.title} ({material.fileType})
                    </span>
                    <RemoveMaterialButton materialId={material.id} />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
