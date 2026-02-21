"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createCourse, updateCourse } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CourseDefaults = {
  id?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string | null;
  pointsOnEnroll?: number;
  pointsOnComplete?: number;
  published?: boolean;
};

export function AdminCourseForm({ defaults }: { defaults?: CourseDefaults }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="grid gap-4"
      action={(formData) => {
        startTransition(async () => {
          const payload = {
            title: String(formData.get("title") || ""),
            description: String(formData.get("description") || ""),
            thumbnailUrl: String(formData.get("thumbnailUrl") || ""),
            pointsOnEnroll: Number(formData.get("pointsOnEnroll") || 0),
            pointsOnComplete: Number(formData.get("pointsOnComplete") || 0),
            published: String(formData.get("published") || "") === "on"
          };

          const result = defaults?.id ? await updateCourse(defaults.id, payload) : await createCourse(payload);

          if (!result.ok) {
            toast.error(result.error);
            return;
          }

          toast.success(defaults?.id ? "Course updated." : "Course created.");
          router.refresh();
        });
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={defaults?.title} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={defaults?.description ?? ""} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
        <Input id="thumbnailUrl" name="thumbnailUrl" defaultValue={defaults?.thumbnailUrl ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="pointsOnEnroll">Points on enroll</Label>
          <Input id="pointsOnEnroll" name="pointsOnEnroll" type="number" defaultValue={defaults?.pointsOnEnroll ?? 20} min={0} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="pointsOnComplete">Points on complete</Label>
          <Input id="pointsOnComplete" name="pointsOnComplete" type="number" defaultValue={defaults?.pointsOnComplete ?? 100} min={0} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={defaults?.published ?? false} />
        Published
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : defaults?.id ? "Update course" : "Create course"}
      </Button>
    </form>
  );
}
