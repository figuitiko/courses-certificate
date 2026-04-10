import Link from "next/link";
import { EnrollmentStatus } from "@prisma/client";

import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const enrollmentStatusLabels: Record<EnrollmentStatus, string> = {
  ENROLLED: "Inscrito",
  COMPLETED: "Completado",
};

export default async function MyCoursesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Necesitas iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Primero inicia sesión desde{" "}
            <Link
              href="/sign-in?next=/my-courses"
              className="text-primary underline"
            >
              Iniciar sesión
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    );
  }

  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
    include: { course: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Mis cursos</h1>
      {enrollments.length === 0 ? (
        <p className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          Todavía no estás inscrito en ningún curso.
        </p>
      ) : (
        <div className="grid gap-4">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id}>
              <CardContent className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold">{enrollment.course.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {enrollmentStatusLabels[enrollment.status]}
                  </p>
                </div>
                <div className="w-full max-w-xs space-y-2">
                  <Progress value={enrollment.progressPercent} />
                  <p className="text-right text-sm text-muted-foreground">
                    {Math.round(enrollment.progressPercent)}%
                  </p>
                </div>
                <Link
                  href={`/learn/${enrollment.courseId}`}
                  className="text-primary underline"
                >
                  Continuar
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
