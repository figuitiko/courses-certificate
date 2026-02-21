import Link from "next/link";

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
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="line-clamp-1 text-xl">{course.title}</CardTitle>
          <Badge variant={course.published ? "default" : "secondary"}>{course.published ? "Published" : "Draft"}</Badge>
        </div>
        <CardDescription className="line-clamp-3">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">
          {course.lessons.length} lessons • {course.pointsOnEnroll} pts on enroll • {course.pointsOnComplete} pts on completion
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/courses/${course.id}`}>View course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
