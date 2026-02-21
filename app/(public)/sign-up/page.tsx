import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { SignUpForm } from "@/components/auth/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignUpPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/courses");
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Set up your learner account to enroll and track progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignUpForm />
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
