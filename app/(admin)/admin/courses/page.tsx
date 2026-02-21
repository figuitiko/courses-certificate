import Link from "next/link";

import { db } from "@/lib/db";
import { isAdminModeEnabled } from "@/lib/auth";
import { AdminCourseForm } from "@/components/admin/admin-course-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminCoursesPage() {
  const adminEnabled = await isAdminModeEnabled();

  if (!adminEnabled) {
    return <p className="rounded-md border border-dashed p-6 text-center text-muted-foreground">Admin mode is disabled.</p>;
  }

  const courses = await db.course.findMany({
    orderBy: { updatedAt: "desc" },
    include: { lessons: true }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Manage Courses</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create course</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminCourseForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lessons</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.published ? "Published" : "Draft"}</TableCell>
                  <TableCell>{course.lessons.length}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/courses/${course.id}`} className="text-primary underline">
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
