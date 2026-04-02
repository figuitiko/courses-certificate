import Link from "next/link";

import { getUserPoints } from "@/actions/points";
import { linkGoogleAccount } from "@/actions/auth";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
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

  const [points, googleAccount] = await Promise.all([
    getUserPoints(),
    db.account.findFirst({
      where: {
        userId: user.id,
        provider: "google",
      },
      select: { provider: true },
    }),
  ]);
  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );
  const googleLinked = Boolean(googleAccount);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p className="text-muted-foreground">Handle: @{user.handle}</p>
        <PointsBadge points={points.totalPoints} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Sign in with Google after linking your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {googleEnabled ? (
            googleLinked ? (
              <p className="text-sm text-muted-foreground">Google connected.</p>
            ) : (
              <form action={linkGoogleAccount.bind(null, "/profile")}>
                <Button type="submit" variant="outline">
                  Connect Google
                </Button>
              </form>
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              Google sign-in is not enabled.
            </p>
          )}
        </CardContent>
      </Card>
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
