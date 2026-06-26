import { getTranslations, getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export const metadata = { title: "Progreso alumnos — Yoliti Academy" };

interface ProgressRow {
  user_id: string; lesson_id: string; completed: boolean; progress_pct: number;
  completed_at: string | null;
  profiles: { full_name: string | null };
  lessons: { title: string; modules: { title: string; courses: { title: string } } };
}
interface GroupProgress {
  id: string; name: string; studentCount: number; courseCount: number;
  completedCount: number; totalCount: number;
}

export default async function ProgresoPage() {
  const [, t, locale] = await Promise.all([
    requireRole("super_admin"),
    getTranslations("adminProgreso"),
    getLocale(),
  ]);
  const supabase = await createClient();

  const { data: progressRaw } = await supabase
    .from("lesson_progress")
    .select("user_id, lesson_id, completed, progress_pct, completed_at, profiles(full_name), lessons(title, modules(title, courses(title)))")
    .order("completed_at", { ascending: false })
    .limit(200);
  const progress = (progressRaw as unknown as ProgressRow[]) ?? [];

  const byUser: Record<string, { name: string; total: number; done: number; avgPct: number }> = {};
  for (const r of progress) {
    if (!byUser[r.user_id]) byUser[r.user_id] = { name: r.profiles?.full_name ?? t("studentFallback"), total: 0, done: 0, avgPct: 0 };
    byUser[r.user_id].total++;
    if (r.completed) byUser[r.user_id].done++;
    byUser[r.user_id].avgPct = Math.round(
      (byUser[r.user_id].avgPct * (byUser[r.user_id].total - 1) + r.progress_pct) / byUser[r.user_id].total
    );
  }

  const { data: groupsRaw } = await supabase
    .from("groups")
    .select("id, name, group_students(user_id), group_courses(course_id)");
  const groups = (groupsRaw as { id: string; name: string; group_students: { user_id: string }[]; group_courses: { course_id: string }[] }[]) ?? [];

  const { data: modulesRaw } = await supabase.from("modules").select("course_id, lessons(id)");
  const lessonsByCourse: Record<string, number> = {};
  for (const m of modulesRaw ?? []) {
    const cid = (m as { course_id: string; lessons: { id: string }[] }).course_id;
    const count = (m as { course_id: string; lessons: { id: string }[] }).lessons.length;
    lessonsByCourse[cid] = (lessonsByCourse[cid] ?? 0) + count;
  }

  const groupProgress: GroupProgress[] = groups.map((g) => {
    const studentIds = g.group_students.map((s) => s.user_id);
    const courseIds = g.group_courses.map((c) => c.course_id);
    const totalLessons = courseIds.reduce((acc, cid) => acc + (lessonsByCourse[cid] ?? 0), 0);
    const totalPossible = totalLessons * studentIds.length;
    const completed = progress.filter((r) => studentIds.includes(r.user_id) && r.completed).length;
    return { id: g.id, name: g.name, studentCount: studentIds.length, courseCount: courseIds.length, completedCount: completed, totalCount: totalPossible };
  });

  const totalCompleted = progress.filter((r) => r.completed).length;
  const totalProgress = progress.length;
  const dateLocale = locale === "en" ? "en-US" : "es-MX";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-secondary">{t("title")}</h1>
        <p className="mt-1 text-sm text-base-content/60">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: "fa-users",      label: t("statActive"),    value: Object.keys(byUser).length },
          { icon: "fa-circle-check",label: t("statCompleted"), value: totalCompleted },
          { icon: "fa-chart-pie",  label: t("statRate"),      value: totalProgress > 0 ? `${Math.round((totalCompleted / totalProgress) * 100)}%` : "—" },
        ].map((m) => (
          <div key={m.label} className="rounded-box border border-base-300 bg-base-100 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <i className={`fa-solid ${m.icon}`} />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-secondary">{m.value}</p>
                <p className="text-xs text-base-content/50">{m.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {groupProgress.length > 0 && (
        <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-secondary">{t("groupTitle")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupProgress.map((g) => {
              const pct = g.totalCount > 0 ? Math.round((g.completedCount / g.totalCount) * 100) : 0;
              return (
                <div key={g.id} className="rounded-xl border border-base-300 p-4">
                  <p className="font-semibold text-secondary">{g.name}</p>
                  <div className="mt-1 flex gap-4 text-xs text-base-content/50">
                    <span><i className="fa-solid fa-users mr-1" />{t("studentsCount", { n: g.studentCount })}</span>
                    <span><i className="fa-solid fa-book mr-1" />{t("coursesCount", { n: g.courseCount })}</span>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-base-content/60">{t("completedLabel")}</span>
                      <span className="font-semibold text-primary">{pct}%</span>
                    </div>
                    <progress className="progress progress-primary w-full" value={pct} max={100} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-secondary">{t("studentTitle")}</h2>
        {Object.keys(byUser).length === 0 ? (
          <p className="text-sm text-base-content/50">{t("noProgress")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("colStudent")}</th>
                  <th>{t("colVisited")}</th>
                  <th>{t("colCompleted")}</th>
                  <th>{t("colAvg")}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(byUser).sort((a, b) => b[1].done - a[1].done).map(([uid, u]) => (
                  <tr key={uid} className="hover">
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-content text-xs font-bold">
                          {(u.name || "?").charAt(0).toUpperCase()}
                        </span>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td>{u.total}</td>
                    <td>
                      <span className="font-semibold text-success">{u.done}</span>
                      <span className="text-base-content/40"> / {u.total}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <progress className="progress progress-primary w-24" value={u.avgPct} max={100} />
                        <span className="text-sm font-semibold text-primary">{u.avgPct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-secondary">{t("activityTitle")}</h2>
        {progress.length === 0 ? (
          <p className="text-sm text-base-content/50">{t("noActivity")}</p>
        ) : (
          <ul className="divide-y divide-base-200">
            {progress.slice(0, 20).map((r, i) => (
              <li key={i} className="flex items-start gap-3 py-3">
                <span className={`mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-xs ${r.completed ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                  <i className={`fa-solid ${r.completed ? "fa-circle-check" : "fa-clock"}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {r.profiles?.full_name ?? t("studentFallback")}{" "}
                    <span className="font-normal text-base-content/50">
                      {r.completed ? t("completedVerb") : t("viewedVerb")}
                    </span>{" "}
                    <span className="text-secondary">{r.lessons?.title}</span>
                  </p>
                  <p className="text-xs text-base-content/40">
                    {r.lessons?.modules?.courses?.title} → {r.lessons?.modules?.title}
                    {r.completed_at && <> · {new Date(r.completed_at).toLocaleString(dateLocale)}</>}
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary">{r.progress_pct}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
