import { listCourses } from "@/actions/courses";
import { CourseCard } from "@/components/course/course-card";

export default async function CoursesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const courses = await listCourses({ publishedOnly: true, query: q });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Course Catalog</h1>
        <p className="text-muted-foreground">Explore consulting courses and enroll to start learning.</p>
      </div>
      {courses.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-muted-foreground">No courses yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
