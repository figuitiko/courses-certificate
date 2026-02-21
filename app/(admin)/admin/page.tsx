import Link from "next/link";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?next=/admin");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const [courses, users] = await Promise.all([
    db.course.count(),
    db.user.count(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Courses ({courses})</CardTitle>
          </CardHeader>
          <CardContent>
            <Link className="text-primary underline" href="/admin/courses">
              Manage courses
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users ({users})</CardTitle>
          </CardHeader>
          <CardContent>
            <Link className="text-primary underline" href="/admin/users">
              View users & points
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
