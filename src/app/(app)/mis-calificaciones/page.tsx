import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import type { QuizAttempt } from "@/lib/types";

export const metadata = { title: "Mis calificaciones — Yoliti Academy" };

interface AttemptWithLesson extends QuizAttempt {
  lessons: {
    title: string;
    modules: {
      courses: { title: string; slug: string } | null;
    } | null;
  } | null;
}

export default async function MisCalificacionesPage() {
  const user = await requireUser();
  const supabase = await createClient();

  let attempts: AttemptWithLesson[] = [];
  try {
    const { data } = await supabase
      .from("quiz_attempts")
      .select(
        "*, lessons(title, modules(courses(title, slug)))"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    attempts = (data as AttemptWithLesson[]) ?? [];
  } catch {
    // tabla puede no existir aún (migración 0005)
  }

  // Agrupar por curso
  const grouped: Record<
    string,
    { courseTitle: string; courseSlug: string; items: AttemptWithLesson[] }
  > = {};

  for (const a of attempts) {
    const courseTitle =
      a.lessons?.modules?.courses?.title ?? "Sin curso";
    const courseSlug =
      a.lessons?.modules?.courses?.slug ?? "";
    const key = courseSlug || courseTitle;
    if (!grouped[key]) {
      grouped[key] = { courseTitle, courseSlug, items: [] };
    }
    grouped[key].items.push(a);
  }

  const groups = Object.values(grouped);

  // Stats globales
  const avgScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((s, a) => s + a.score_pct, 0) / attempts.length
        )
      : null;
  const passed = attempts.filter((a) => a.score_pct >= 70).length;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-secondary">
          Mis calificaciones
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Historial de quizzes y resultados obtenidos.
        </p>
      </div>

      {/* Stats */}
      {attempts.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: "fa-list-check",
              label: "Quizzes realizados",
              value: attempts.length,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              icon: "fa-circle-check",
              label: "Aprobados",
              value: `${passed} / ${attempts.length}`,
              color: "text-success",
              bg: "bg-success/10",
            },
            {
              icon: "fa-chart-simple",
              label: "Promedio general",
              value: avgScore !== null ? `${avgScore}%` : "—",
              color: "text-secondary",
              bg: "bg-secondary/10",
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
                  <p className="text-2xl font-extrabold text-secondary">
                    {s.value}
                  </p>
                  <p className="text-xs text-base-content/50">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Listado */}
      {groups.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 bg-base-100 p-12 text-center">
          <i className="fa-solid fa-circle-question mb-3 text-3xl text-base-content/20" />
          <p className="text-base-content/50">
            Aún no has completado ningún quiz.
          </p>
          <p className="mt-1 text-xs text-base-content/30">
            Tus calificaciones aparecerán aquí cuando completes quizzes en tus
            cursos.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <section
              key={g.courseSlug || g.courseTitle}
              className="rounded-box border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="border-b border-base-300 px-6 py-4">
                <h2 className="font-bold text-secondary">{g.courseTitle}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Quiz</th>
                      <th className="text-center">Calificación</th>
                      <th className="text-center">Resultado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.items.map((a) => (
                      <tr key={a.id} className="hover">
                        <td className="font-medium">
                          {a.lessons?.title ?? "Quiz"}
                        </td>
                        <td className="text-center">
                          <span
                            className={`text-lg font-extrabold ${
                              a.score_pct >= 70
                                ? "text-success"
                                : "text-error"
                            }`}
                          >
                            {a.score_pct}%
                          </span>
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge badge-sm ${
                              a.score_pct >= 70
                                ? "badge-success"
                                : "badge-error"
                            }`}
                          >
                            {a.score_pct >= 70 ? "Aprobado" : "Reprobado"}
                          </span>
                        </td>
                        <td className="text-xs text-base-content/50">
                          {new Date(a.created_at).toLocaleDateString("es-MX", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
