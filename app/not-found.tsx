import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Link className="text-primary underline" href="/courses">
        Browse courses
      </Link>
    </div>
  );
}
