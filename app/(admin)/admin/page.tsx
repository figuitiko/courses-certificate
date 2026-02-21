import Link from "next/link";

import { db } from "@/lib/db";
import { isAdminModeEnabled } from "@/lib/auth";
import { AdminModeToggle } from "@/components/admin/admin-mode-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [adminEnabled, courses, users] = await Promise.all([
    isAdminModeEnabled(),
    db.course.count(),
    db.user.count()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <AdminModeToggle enabled={adminEnabled} />
      </div>
      {!adminEnabled ? (
        <Card>
          <CardContent className="pt-6 text-muted-foreground">Enable admin mode to manage content.</CardContent>
        </Card>
      ) : (
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
      )}
    </div>
  );
}
