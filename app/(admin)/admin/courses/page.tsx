import Link from "next/link";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { AdminCourseForm } from "@/components/admin/admin-course-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminCoursesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?next=/admin/courses");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const courses = await db.course.findMany({
    orderBy: { updatedAt: "desc" },
    include: { lessons: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Administrar cursos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Crear curso</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminCourseForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cursos existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Lecciones</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    {course.published ? "Publicado" : "Borrador"}
                  </TableCell>
                  <TableCell>{course.lessons.length}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="text-primary underline"
                    >
                      Editar
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
