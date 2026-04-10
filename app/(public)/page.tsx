import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChartNoAxesColumn,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  Stars,
} from "lucide-react";

import { listCourses } from "@/actions/courses";
import { CourseCard } from "@/components/course/course-card";
import { Button } from "@/components/ui/button";

const chapterLinks = [
  { id: "capitulo-01", label: "El reto" },
  { id: "capitulo-02", label: "La experiencia" },
  { id: "capitulo-03", label: "Los cursos" },
  { id: "capitulo-04", label: "El siguiente paso" },
];

const frictionPoints = [
  {
    title: "Mucho contenido, poca aplicación",
    description:
      "La mayoría de las plataformas enseñan teoría, pero no te ayudan a traducirla en mejores reuniones, mejores entregables o mejores decisiones.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Aprender se siente pesado",
    description:
      "Cuando todo parece un curso eterno, es difícil mantener ritmo. Necesitas avances pequeños, claros y fáciles de sostener en tu semana.",
    icon: PlayCircle,
  },
  {
    title: "No siempre ves tu progreso",
    description:
      "Si no puedes medir lo que ya avanzaste, es más fácil abandonar. Un buen sistema hace visible cada logro para que quieras seguir.",
    icon: ChartNoAxesColumn,
  },
];

const learningRhythm = [
  {
    title: "Explora",
    description:
      "Encuentra cursos concretos según la habilidad que quieres fortalecer: discovery, comunicación, estructura, análisis o entrega.",
  },
  {
    title: "Practica",
    description:
      "Consume lecciones cortas, descarga materiales y convierte cada módulo en algo que puedas usar en tu siguiente proyecto.",
  },
  {
    title: "Consolida",
    description:
      "Marca avances, gana puntos y construye una sensación de progreso real que te mantenga constante.",
  },
];

const promiseCards = [
  "Pensado para consultores y equipos que necesitan claridad, no ruido.",
  "Un tono cercano y profesional para aprender sin sentir que entraste a una plataforma fría.",
  "Cursos ordenados para moverte con intención desde el primer clic hasta la ejecución.",
];

export default async function HomePage() {
  const courses = await listCourses({ publishedOnly: true });
  const featured = courses.slice(0, 3);
  const totalLessons = courses.reduce(
    (sum, course) => sum + course.lessons.length,
    0,
  );
  const totalEnrollPoints = courses.reduce(
    (sum, course) => sum + course.pointsOnEnroll,
    0,
  );

  return (
    <div className="space-y-14 pb-10 md:space-y-20">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-white/75 bg-[linear-gradient(135deg,rgba(240,249,255,0.98),rgba(255,247,237,0.92)_48%,rgba(255,255,255,0.86))] px-6 py-8 shadow-[0_40px_140px_-72px_rgba(14,74,110,0.45)] sm:px-8 md:px-10 md:py-12">
        <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-sky-200/45 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-orange-200/50 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-24 w-24 rounded-full border border-white/60 bg-white/30 blur-xl" />

        <div className="relative grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_280px]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/45 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-sky-800 shadow-sm">
              <Stars className="h-4 w-4" />
              Hecho para consultores en México
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
              <div className="space-y-5">
                <h1 className="max-w-4xl text-[clamp(3.2rem,8vw,6.8rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-sky-950">
                  Aprender consultoría debería sentirse claro, útil y humano.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-sky-900/78 md:text-xl">
                  Consulting Academy transforma el aterrizaje en algo más
                  amigable: cursos prácticos, materiales accionables y una
                  experiencia que acompaña tu crecimiento sin saturarte.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-[1.75rem] border border-white/80 bg-white/78 p-5 shadow-[0_18px_54px_-40px_rgba(14,74,110,0.5)] backdrop-blur">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sky-800/70">
                    Cursos activos
                  </p>
                  <p className="mt-2 text-4xl font-semibold leading-none text-sky-950">
                    {courses.length}
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-white/80 bg-white/78 p-5 shadow-[0_18px_54px_-40px_rgba(14,74,110,0.5)] backdrop-blur">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sky-800/70">
                    Lecciones listas
                  </p>
                  <p className="mt-2 text-4xl font-semibold leading-none text-sky-950">
                    {totalLessons}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-sky-900 px-7 text-white shadow-[0_20px_50px_-22px_rgba(12,74,110,0.72)] hover:bg-sky-950"
              >
                <Link href="/courses">
                  Ver cursos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                size="lg"
                className="rounded-full border-white/85 bg-white/74 px-7 text-sky-950"
              >
                <Link href="/sign-up">Crear cuenta</Link>
              </Button>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              {promiseCards.map((copy) => (
                <div
                  key={copy}
                  className="rounded-[1.5rem] border border-white/75 bg-white/62 p-4 text-sm leading-6 text-sky-900/78 shadow-[0_16px_40px_-34px_rgba(14,74,110,0.45)] backdrop-blur"
                >
                  {copy}
                </div>
              ))}
            </div>
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-4 rounded-[1.8rem] border border-white/80 bg-white/76 p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.28)] backdrop-blur">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sky-800/70">
                Recorrido
              </p>
              <nav className="space-y-2">
                {chapterLinks.map((chapter, index) => (
                  <a
                    key={chapter.id}
                    href={`#${chapter.id}`}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-transparent px-3 py-3 text-sm text-sky-900/72 transition-colors duration-200 hover:border-sky-200 hover:bg-sky-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>
                      {String(index + 1).padStart(2, "0")}. {chapter.label}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ))}
              </nav>
              <div className="rounded-[1.4rem] bg-sky-950 px-4 py-5 text-white">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sky-200">
                  Puntos para empezar
                </p>
                <p className="mt-2 text-4xl font-semibold leading-none">
                  {totalEnrollPoints}
                </p>
                <p className="mt-3 text-sm leading-6 text-sky-100/78">
                  Una forma simple de hacer visible tu avance desde el primer
                  curso.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="capitulo-01"
        className="grid gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]"
      >
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
            Capítulo 01
          </p>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-sky-950">
            El problema no es aprender. Es aprender sin estructura.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {frictionPoints.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-[1.8rem] border border-white/75 bg-white/70 p-6 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.3)] backdrop-blur"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-900">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold leading-tight text-sky-950">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-sky-900/74">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="capitulo-02"
        className="relative overflow-hidden rounded-[2rem] border border-white/75 bg-[linear-gradient(160deg,rgba(255,255,255,0.84),rgba(224,242,254,0.84))] p-6 shadow-[0_30px_90px_-64px_rgba(14,74,110,0.45)] md:p-8"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
              Capítulo 02
            </p>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight text-sky-950">
              Una experiencia pensada para que sí quieras volver.
            </h2>
            <p className="max-w-xl text-base leading-8 text-sky-900/76">
              La página de inicio ahora presenta un recorrido más claro: primero
              entiende el valor, después siente cómo funciona y al final entra a
              los cursos con una expectativa mucho más precisa.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {learningRhythm.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[1.6rem] border border-white/75 bg-white/78 p-5 shadow-[0_16px_40px_-34px_rgba(14,74,110,0.34)]"
              >
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sky-700/70">
                  Paso {index + 1}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-sky-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-sky-900/74">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="capitulo-03"
        className="grid gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]"
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
            Capítulo 03
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-sky-950">
            Cursos que se sienten accionables desde la portada.
          </h2>
          <p className="text-base leading-8 text-sky-900/76">
            Reorganicé el home para que la zona de cursos llegue después de una
            narrativa más convincente. Así el usuario entiende mejor por qué
            debería explorar antes de ver la primera tarjeta.
          </p>
          <div className="rounded-[1.6rem] border border-sky-200/70 bg-sky-50/90 p-5 text-sky-950 shadow-[0_16px_40px_-30px_rgba(14,74,110,0.25)]">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-orange-500" />
              <p className="text-sm leading-7">
                Lecciones más cortas, beneficios más claros y una promesa de
                valor mejor ubicada para aumentar intención de clic.
              </p>
            </div>
          </div>
        </div>

        {featured.length === 0 ? (
          <p className="rounded-[1.6rem] border border-dashed border-sky-200 bg-white/65 p-10 text-center text-sky-900/66">
            Aún no hay cursos publicados.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      <section
        id="capitulo-04"
        className="overflow-hidden rounded-[2.25rem] border border-white/80 bg-sky-950 px-6 py-8 text-white shadow-[0_40px_100px_-60px_rgba(2,8,23,0.72)] md:px-8 md:py-10"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">
              Capítulo 04
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              Si la primera impresión se siente ligera y útil, explorar se vuelve
              una decisión natural.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-sky-100/76">
              Ese es el objetivo de este rediseño: una portada más amable,
              memorable y orientada a conversión, sin perder claridad ni caer en
              efectos gratuitos.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-orange-500 px-7 text-white shadow-[0_20px_50px_-25px_rgba(249,115,22,0.8)] hover:bg-orange-600"
            >
              <Link href="/courses">
                Explorar catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              size="lg"
              className="rounded-full border-white/20 bg-white/8 px-7 text-white hover:bg-white/14"
            >
              <Link href="/sign-up">
                Empezar ahora
                <Sparkles className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
