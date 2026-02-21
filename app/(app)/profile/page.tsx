import Link from "next/link";

import { getUserPoints } from "@/actions/points";
import { getCurrentUser } from "@/lib/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PointsBadge } from "@/components/points/points-badge";
import { PointsLedgerTable } from "@/components/points/points-ledger-table";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <CardDescription>
            Sign in to view your profile and points ledger.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/sign-in?next=/profile"
            className="text-primary underline"
          >
            Go to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  const points = await getUserPoints();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p className="text-muted-foreground">Handle: @{user.handle}</p>
        <PointsBadge points={points.totalPoints} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Points Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <PointsLedgerTable rows={points.ledger} />
        </CardContent>
      </Card>
    </div>
  );
}
