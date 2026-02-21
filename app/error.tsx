"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="space-y-4 py-16 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground">{error.message || "Unexpected application error."}</p>
      <button onClick={reset} className="rounded-md border px-4 py-2 text-sm">
        Try again
      </button>
    </div>
  );
}
