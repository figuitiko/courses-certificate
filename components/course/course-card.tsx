import Link from "next/link";
import { ArrowUpRight, BookOpen, Sparkles, Trophy } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CourseCardProps = {
  course: {
    id: string;
    title: string;
    description: string;
    published: boolean;
    pointsOnEnroll: number;
    pointsOnComplete: number;
    lessons: { id: string }[];
  };
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-white/70 bg-white/75 shadow-[0_20px_60px_-36px_rgba(109,77,43,0.45)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-34px_rgba(109,77,43,0.6)]">
      <CardHeader className="gap-4 border-b border-border/60 bg-[linear-gradient(135deg,rgba(255,247,238,0.95),rgba(240,248,251,0.82))]">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant={course.published ? "default" : "secondary"}
            className="rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em]"
          >
            {course.published ? "Publicado" : "Borrador"}
          </Badge>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 bg-white/80 text-primary shadow-sm transition duration-300 group-hover:rotate-6">
            <Sparkles className="h-4 w-4" />
          </span>
        </div>
        <div className="space-y-2">
          <CardTitle className="line-clamp-2 text-2xl leading-tight text-foreground">
            {course.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-[0.95rem] leading-6 text-muted-foreground">
            {course.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>{course.lessons.length} lecciones prácticas</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span>
              {course.pointsOnEnroll} pts al iniciar, {course.pointsOnComplete} pts
              al completar
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full rounded-full">
          <Link href={`/courses/${course.id}`}>
            Explorar curso
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
