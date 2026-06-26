import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import type { Category, Course } from "@/lib/types";

export const metadata = { title: "Panel de maestro — Yoliti Academy" };

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function createCourse(formData: FormData) {
  "use server";
  const profile = await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const priceMx = Number(formData.get("price") ?? 0);

  await supabase.from("courses").insert({
    title,
    slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`,
    subtitle: String(formData.get("subtitle") ?? ""),
    description: String(formData.get("description") ?? ""),
    level: String(formData.get("level") ?? "principiante"),
    price_cents: Math.round(priceMx * 100),
    currency: "mxn",
    status: String(formData.get("status") ?? "borrador"),
    teacher_id: profile.id,
  });

  revalidatePath("/maestro");
}

interface CourseMetrics extends Course {
  enrollmentCount: number;
  avgProgress: number;
  avgScore: number | null;
}

export default async function MaestroPage() {
  const profile = await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();

  const query = supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (profile.role !== "super_admin") {
    query.eq("teacher_id", profile.id);
  }
  const { data } = await query;
  const courses = (data as Course[]) ?? [];
  const courseIds = courses.map((c) => c.id);

  // Inscripciones por curso
  const enrollmentMap: Record<string, number> = {};
  if (courseIds.length > 0) {
    const { data: enrs } = await supabase
      .from("enrollments")
      .select("course_id")
      .in("course_id", courseIds)
      .eq("status", "activo");
    for (const e of enrs ?? []) {
      enrollmentMap[e.course_id] = (enrollmentMap[e.course_id] ?? 0) + 1;
    }
  }

  // Progreso promedio por curso (via lesson_progress + modules + lessons)
  const progressMap: Record<string, number> = {};
  const quizScoreMap: Record<string, number | null> = {};

  if (courseIds.length > 0) {
    const { data: mods } = await supabase
      .from("modules")
      .select("course_id, lessons(id)")
      .in("course_id", courseIds);

    const courseLessonMap: Record<string, string[]> = {};
    for (const m of mods ?? []) {
      const ids = (m.lessons as { id: string }[]).map((l) => l.id);
      courseLessonMap[m.course_id] = [
        ...(courseLessonMap[m.course_id] ?? []),
        ...ids,
      ];
    }

    const allLessonIds = Object.values(courseLessonMap).flat();
    if (allLessonIds.length > 0) {
      const { data: progRows } = await supabase
        .from("lesson_progress")
        .select("lesson_id, progress_pct")
        .in("lesson_id", allLessonIds);

      // Calcular promedio por curso
      for (const [courseId, lessonIds] of Object.entries(courseLessonMap)) {
        const rows = (progRows ?? []).filter((r) =>
          lessonIds.includes(r.lesson_id)
        );
        if (rows.length > 0) {
          progressMap[courseId] = Math.round(
            rows.reduce(
              (s: number, r: { progress_pct: number }) => s + r.progress_pct,
              0
            ) / rows.length
          );
        } else {
          progressMap[courseId] = 0;
        }
      }

      // Quiz scores por curso
      try {
        const { data: attempts } = await supabase
          .from("quiz_attempts")
          .select("lesson_id, score_pct")
          .in("lesson_id", allLessonIds);

        for (const [courseId, lessonIds] of Object.entries(courseLessonMap)) {
          const rows = (attempts ?? []).filter((a) =>
            lessonIds.includes(a.lesson_id)
          );
          quizScoreMap[courseId] =
            rows.length > 0
              ? Math.round(
                  rows.reduce((s: number, r: { score_pct: number }) => s + r.score_pct, 0) /
                    rows.length
                )
              : null;
        }
      } catch {
        // tabla quiz_attempts no existe aún
      }
    }
  }

  const { data: categoriesRaw } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");
  const categories = (categoriesRaw as Pick<Category, "id" | "name">[]) ?? [];

  const courseMetrics: CourseMetrics[] = courses.map((c) => ({
    ...c,
    enrollmentCount: enrollmentMap[c.id] ?? 0,
    avgProgress: progressMap[c.id] ?? 0,
    avgScore: quizScoreMap[c.id] ?? null,
  }));

  // Stats globales del maestro
  const totalStudents = Object.values(enrollmentMap).reduce((s, n) => s + n, 0);
  const publishedCourses = courses.filter((c) => c.status === "publicado").length;

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-secondary">
          Panel de maestro
        </h1>
        <p className="mt-1 text-base-content/60">
          Gestiona tus cursos y monitorea el progreso de tus alumnos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: "fa-book-open",
            label: "Cursos publicados",
            value: publishedCourses,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            icon: "fa-users",
            label: "Alumnos totales",
            value: totalStudents,
            color: "text-secondary",
            bg: "bg-secondary/10",
          },
          {
            icon: "fa-book",
            label: "Cursos creados",
            value: courses.length,
            color: "text-accent",
            bg: "bg-accent/10",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-box border border-base-300 bg-base-100 p-5"
          >
            <div className="flex items-center gap-3">
              <span
                className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl ${s.bg} ${s.color}`}
              >
                <i className={`fa-solid ${s.icon}`} />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-secondary">{s.value}</p>
                <p className="text-xs text-base-content/50">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Tabla de cursos con métricas */}
        <section>
          <h2 className="mb-4 font-bold text-secondary">Mis cursos</h2>
          {courseMetrics.length > 0 ? (
            <div className="space-y-4">
              {courseMetrics.map((c) => (
                <div
                  key={c.id}
                  className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-secondary truncate">
                          {c.title}
                        </h3>
                        <span
                          className={`badge badge-sm capitalize ${
                            c.status === "publicado"
                              ? "badge-success text-white"
                              : c.status === "archivado"
                                ? "badge-ghost"
                                : "badge-warning text-white"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-base-content/50 mt-0.5 capitalize">
                        {c.level} ·{" "}
                        {c.price_cents === 0
                          ? "Gratis"
                          : formatPrice(c.price_cents, c.currency)}
                      </p>
                    </div>
                    <Link
                      href={`/admin/cursos/${c.id}`}
                      className="btn btn-ghost btn-xs flex-shrink-0"
                    >
                      Editar
                    </Link>
                  </div>

                  {/* Métricas */}
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-base-200 px-3 py-2">
                      <p className="text-lg font-extrabold text-secondary">
                        {c.enrollmentCount}
                      </p>
                      <p className="text-xs text-base-content/50">Alumnos</p>
                    </div>
                    <div className="rounded-xl bg-base-200 px-3 py-2">
                      <p className="text-lg font-extrabold text-secondary">
                        {c.avgProgress}%
                      </p>
                      <p className="text-xs text-base-content/50">
                        Progreso prom.
                      </p>
                    </div>
                    <div className="rounded-xl bg-base-200 px-3 py-2">
                      <p
                        className={`text-lg font-extrabold ${
                          c.avgScore !== null
                            ? c.avgScore >= 70
                              ? "text-success"
                              : "text-error"
                            : "text-base-content/30"
                        }`}
                      >
                        {c.avgScore !== null ? `${c.avgScore}%` : "—"}
                      </p>
                      <p className="text-xs text-base-content/50">
                        Puntaje quiz
                      </p>
                    </div>
                  </div>

                  {/* Barra progreso promedio */}
                  {c.enrollmentCount > 0 && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full bg-base-300">
                        <div
                          className="h-1.5 rounded-full bg-primary transition-all"
                          style={{ width: `${c.avgProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-box border border-dashed border-base-300 p-8 text-center text-sm text-base-content/50">
              Todavía no has creado cursos. Usa el formulario para empezar.
            </p>
          )}
        </section>

        {/* Formulario crear curso */}
        <section>
          <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="font-bold text-secondary">Nuevo curso</h2>
            <form action={createCourse} className="mt-4 space-y-3">
              <input
                name="title"
                required
                placeholder="Título del curso"
                className="input input-bordered input-sm w-full"
              />
              <input
                name="subtitle"
                placeholder="Subtítulo"
                className="input input-bordered input-sm w-full"
              />
              <textarea
                name="description"
                placeholder="Descripción"
                className="textarea textarea-bordered textarea-sm w-full"
              />

              <select
                name="level"
                className="select select-bordered select-sm w-full"
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
              <input
                name="price"
                type="number"
                min="0"
                step="1"
                defaultValue={0}
                placeholder="Precio (MXN, 0 = gratis)"
                className="input input-bordered input-sm w-full"
              />
              <select
                name="status"
                className="select select-bordered select-sm w-full"
              >
                <option value="borrador">Borrador</option>
                <option value="publicado">Publicado</option>
              </select>
              <button className="btn btn-primary btn-sm btn-block">
                <i className="fa-solid fa-plus" /> Crear curso
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
