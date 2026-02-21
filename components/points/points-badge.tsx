import { Badge } from "@/components/ui/badge";

export function PointsBadge({ points }: { points: number }) {
  return <Badge className="text-sm">Total points: {points}</Badge>;
}
