import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.upsert({
    where: { id: "course_consulting_foundations" },
    update: {
      title: "Consulting Foundations",
      description: "A practical starter path for client discovery, scoping, and delivery.",
      published: true,
      pointsOnEnroll: 20,
      pointsOnComplete: 100
    },
    create: {
      id: "course_consulting_foundations",
      title: "Consulting Foundations",
      description: "A practical starter path for client discovery, scoping, and delivery.",
      published: true,
      pointsOnEnroll: 20,
      pointsOnComplete: 100
    }
  });

  const lessons = [
    {
      id: "lesson_discovery",
      title: "Discovery Calls",
      order: 1,
      content: "Learn the discovery framework and core intake questions.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      pointsOnComplete: 10
    },
    {
      id: "lesson_scoping",
      title: "Project Scoping",
      order: 2,
      content: "Turn ambiguous needs into clear deliverables and timelines.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      pointsOnComplete: 15
    }
  ];

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {
        courseId: course.id,
        title: lesson.title,
        order: lesson.order,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        pointsOnComplete: lesson.pointsOnComplete
      },
      create: {
        id: lesson.id,
        courseId: course.id,
        title: lesson.title,
        order: lesson.order,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        pointsOnComplete: lesson.pointsOnComplete
      }
    });
  }

  await prisma.material.upsert({
    where: { id: "material_discovery_template" },
    update: {
      lessonId: "lesson_discovery",
      title: "Discovery Call Template",
      fileUrl: "https://example.com/discovery-template.pdf",
      fileType: "pdf"
    },
    create: {
      id: "material_discovery_template",
      lessonId: "lesson_discovery",
      title: "Discovery Call Template",
      fileUrl: "https://example.com/discovery-template.pdf",
      fileType: "pdf"
    }
  });

  await prisma.material.upsert({
    where: { id: "material_scope_worksheet" },
    update: {
      lessonId: "lesson_scoping",
      title: "Scoping Worksheet",
      fileUrl: "https://example.com/scoping-worksheet.pdf",
      fileType: "pdf"
    },
    create: {
      id: "material_scope_worksheet",
      lessonId: "lesson_scoping",
      title: "Scoping Worksheet",
      fileUrl: "https://example.com/scoping-worksheet.pdf",
      fileType: "pdf"
    }
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
