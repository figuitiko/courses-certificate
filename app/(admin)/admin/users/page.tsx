import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { AdminAdjustPointsForm } from "@/components/admin/admin-adjust-points-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in?next=/admin/users");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      points: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Users & Points</h1>
      <Card>
        <CardHeader>
          <CardTitle>User list</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Handle</TableHead>
                <TableHead>Total points</TableHead>
                <TableHead>Adjust points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>@{user.handle}</TableCell>
                  <TableCell>{user.totalPoints}</TableCell>
                  <TableCell>
                    <AdminAdjustPointsForm userId={user.id} />
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
