import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { signInWithGoogle } from "@/actions/auth";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );
  const nextPath =
    params.next && params.next.startsWith("/") ? params.next : "/courses";

  if (session?.user) {
    redirect(nextPath as never);
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Use your email/password or continue with Google.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignInForm nextPath={nextPath} />
        {googleEnabled && (
          <form action={signInWithGoogle.bind(null, nextPath)}>
            <Button type="submit" variant="outline" className="w-full">
              Continue with Google
            </Button>
          </form>
        )}
        <p className="text-sm text-muted-foreground">
          No account yet?{" "}
          <Link href="/sign-up" className="text-primary underline">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
