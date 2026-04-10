import { PointSourceType } from "@prisma/client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const sourceLabels: Record<PointSourceType, string> = {
  COURSE_ENROLL: "Inscripción al curso",
  LESSON_COMPLETE: "Lección completada",
  COURSE_COMPLETE: "Curso completado",
  ADMIN_ADJUST: "Ajuste administrativo"
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
          <TableHead>Evento</TableHead>
          <TableHead>Nota</TableHead>
          <TableHead className="text-right">Puntos</TableHead>
          <TableHead className="text-right">Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              Aún no hay movimientos de puntos.
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
