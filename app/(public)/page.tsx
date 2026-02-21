import Link from "next/link";

import { listCourses } from "@/actions/courses";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course/course-card";

export default async function HomePage() {
  const courses = await listCourses({ publishedOnly: true });
  const featured = courses.slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 rounded-2xl border bg-card/70 p-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Grow Consulting Skills with Guided, Practical Training
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Consulting Academy helps you enroll in structured courses, watch
          lesson videos, download templates, and earn points as you progress.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/courses">Browse courses</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/sign-up">Create account</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Featured courses</h2>
        {featured.length === 0 ? (
          <p className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
            No published courses yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
