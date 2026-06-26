import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import type { Course, Certificate } from "@/lib/types";

export const metadata = { title: "Mi aprendizaje — Yoliti Academy" };

interface EnrollmentRow {
  status: string;
  courses: Course;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  // Cursos inscritos
  const { data: enrollmentsRaw } = await supabase
    .from("enrollments")
    .select("status, courses(*)")
    .eq("user_id", user.id);
  const enrollments = (enrollmentsRaw as EnrollmentRow[] | null) ?? [];
  const courses = enrollments.map((e) => e.courses);

  // Progreso por curso
  const allLessonIds: string[] = [];
  const courseLessonMap: Record<string, string[]> = {};

  if (courses.length > 0) {
    const courseIds = courses.map((c) => c.id);
    const { data: mods } = await supabase
      .from("modules")
      .select("course_id, lessons(id)")
      .in("course_id", courseIds);

    for (const m of mods ?? []) {
      const ids = (m.lessons as { id: string }[]).map((l) => l.id);
      courseLessonMap[m.course_id] = [
        ...(courseLessonMap[m.course_id] ?? []),
        ...ids,
      ];
      allLessonIds.push(...ids);
    }
  }

  const completedSet = new Set<string>();
  if (allLessonIds.length > 0) {
    const { data: prog } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("completed", true)
      .in("lesson_id", allLessonIds);
    for (const p of prog ?? []) completedSet.add(p.lesson_id);
  }

  // Certificados
  let certificates: (Certificate & { courses: Pick<Course, "title" | "slug"> })[] = [];
  try {
    const { data } = await supabase
      .from("certificates")
      .select("*, courses(title, slug)")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });
    certificates = (data as typeof certificates) ?? [];
  } catch {
    // tabla puede no existir aún
  }

  // Calcular stats
  const completedCourses = courses.filter((c) => {
    const ids = courseLessonMap[c.id] ?? [];
    return ids.length > 0 && ids.every((id) => completedSet.has(id));
  });

  // Build course rows with progress
  const courseRows = courses.map((c) => {
    const ids = courseLessonMap[c.id] ?? [];
    const done = ids.filter((id) => completedSet.has(id)).length;
    const pct = ids.length > 0 ? Math.round((done / ids.length) * 100) : 0;
    return { ...c, totalLessons: ids.length, doneLessons: done, pct };
  });

  const stats = [
    {
      icon: "fa-book-open",
      label: "Cursos inscritos",
      value: courses.length,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: "fa-circle-check",
      label: "Completados",
      value: completedCourses.length,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      icon: "fa-certificate",
      label: "Certificados",
      value: certificates.length,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-secondary">Mi aprendizaje</h1>
        <p className="mt-1 text-base-content/60">
          Continúa donde lo dejaste o explora cursos nuevos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
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

      {/* Cursos */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-secondary">Mis cursos</h2>
          <Link href="/cursos" className="btn btn-ghost btn-xs text-primary">
            Explorar más <i className="fa-solid fa-arrow-right text-[10px]" />
          </Link>
        </div>

        {courseRows.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {courseRows.map((c) => (
              <div
                key={c.id}
                className="card border border-base-300 bg-base-100 shadow-sm"
              >
                {c.cover_url && (
                  <figure className="h-32 overflow-hidden">
                    <img
                      src={c.cover_url}
                      alt={c.title}
                      className="h-full w-full object-cover"
                    />
                  </figure>
                )}
                <div className="card-body gap-3 p-5">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="badge badge-primary badge-sm capitalize text-white mb-1">
                        {c.level}
                      </span>
                      <h2 className="card-title text-base text-secondary leading-tight">
                        {c.title}
                      </h2>
                      {c.subtitle && (
                        <p className="text-xs text-base-content/50 mt-0.5 line-clamp-1">
                          {c.subtitle}
                        </p>
                      )}
                    </div>
                    {c.pct === 100 && (
                      <span className="badge badge-success badge-sm flex-shrink-0 gap-1 text-white">
                        <i className="fa-solid fa-check text-[8px]" />
                        Completado
                      </span>
                    )}
                  </div>

                  {/* Barra de progreso */}
                  {c.totalLessons > 0 && (
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-base-content/50">
                        <span>
                          {c.doneLessons}/{c.totalLessons} lecciones
                        </span>
                        <span className="font-medium">{c.pct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-base-300">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            c.pct === 100 ? "bg-success" : "bg-primary"
                          }`}
                          style={{ width: `${c.pct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="card-actions">
                    <Link
                      href={`/aprender/${c.slug}`}
                      className={`btn btn-sm btn-block ${
                        c.pct === 100 ? "btn-outline btn-success" : "btn-primary"
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          c.pct === 100 ? "fa-rotate-right" : "fa-play"
                        }`}
                      />
                      {c.pct === 0
                        ? "Empezar"
                        : c.pct === 100
                          ? "Repasar"
                          : "Continuar"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-box border border-dashed border-base-300 bg-base-100 p-12 text-center">
            <i className="fa-solid fa-compass mb-3 text-3xl text-primary" />
            <p className="text-base-content/60">
              Aún no estás inscrito en ningún curso.
            </p>
            <Link href="/cursos" className="btn btn-primary mt-4">
              Explorar cursos
            </Link>
          </div>
        )}
      </section>

      {/* Certificados */}
      {certificates.length > 0 && (
        <section>
          <h2 className="mb-4 font-bold text-secondary">Mis certificados</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center gap-4 rounded-box border border-base-300 bg-base-100 p-4 shadow-sm"
              >
                <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-warning/10 text-warning text-xl">
                  <i className="fa-solid fa-certificate" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-secondary truncate">
                    {cert.courses?.title ?? "Curso"}
                  </p>
                  <p className="text-xs text-base-content/50">
                    Emitido{" "}
                    {new Date(cert.issued_at).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Link
                  href={`/certificados/${cert.code}`}
                  target="_blank"
                  className="btn btn-ghost btn-xs text-primary"
                >
                  Ver <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
