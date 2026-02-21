import { PointSourceType } from "@prisma/client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const sourceLabels: Record<PointSourceType, string> = {
  COURSE_ENROLL: "Course enroll",
  LESSON_COMPLETE: "Lesson complete",
  COURSE_COMPLETE: "Course complete",
  ADMIN_ADJUST: "Admin adjust"
};

export function PointsLedgerTable({
  rows
}: {
  rows: {
    id: string;
    sourceType: PointSourceType;
    points: number;
    note: string | null;
    createdAt: Date;
  }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Note</TableHead>
          <TableHead className="text-right">Points</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No point activity yet.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{sourceLabels[row.sourceType]}</TableCell>
              <TableCell>{row.note || "-"}</TableCell>
              <TableCell className="text-right font-medium">{row.points > 0 ? `+${row.points}` : row.points}</TableCell>
              <TableCell className="text-right text-muted-foreground">{row.createdAt.toLocaleDateString()}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
