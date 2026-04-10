import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">Página no encontrada</h1>
      <p className="text-muted-foreground">La página que buscas no existe.</p>
      <Link className="text-primary underline" href="/courses">
        Ver cursos
      </Link>
    </div>
  );
}
