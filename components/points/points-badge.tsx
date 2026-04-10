import { Badge } from "@/components/ui/badge";

export function PointsBadge({ points }: { points: number }) {
  return <Badge className="text-sm">Puntos totales: {points}</Badge>;
}
