import { getUserPoints } from "@/actions/points";
import { getCurrentUser } from "@/lib/session";
import { ProfileForm } from "@/components/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PointsBadge } from "@/components/points/points-badge";
import { PointsLedgerTable } from "@/components/points/points-ledger-table";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Create your learner profile</CardTitle>
          <CardDescription>This MVP uses a simple handle stored in a secure cookie.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    );
  }

  const points = await getUserPoints({ userId: user.id });

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
