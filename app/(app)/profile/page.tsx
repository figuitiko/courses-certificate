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
          <CardTitle>Necesitas iniciar sesión</CardTitle>
          <CardDescription>
            Inicia sesión para ver tu perfil y tu historial de puntos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/sign-in?next=/profile"
            className="text-primary underline"
          >
            Ir a iniciar sesión
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
        <h1 className="text-3xl font-semibold">Perfil</h1>
        <p className="text-muted-foreground">Usuario: @{user.handle}</p>
        <PointsBadge points={points.totalPoints} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cuentas conectadas</CardTitle>
          <CardDescription>
            Vincula tu cuenta para poder iniciar sesión con Google.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {googleEnabled ? (
            googleLinked ? (
              <p className="text-sm text-muted-foreground">Google conectado.</p>
            ) : (
              <form action={linkGoogleAccount.bind(null, "/profile")}>
                <Button type="submit" variant="outline">
                  Conectar Google
                </Button>
              </form>
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              El inicio de sesión con Google no está habilitado.
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Historial de puntos</CardTitle>
        </CardHeader>
        <CardContent>
          <PointsLedgerTable rows={points.ledger} />
        </CardContent>
      </Card>
    </div>
  );
}
