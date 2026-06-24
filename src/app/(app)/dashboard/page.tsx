import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import type { Course } from "@/lib/types";

export const metadata = { title: "Mi aprendizaje — Yoliti Academy" };

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("enrollments")
    .select("status, courses(*)")
    .eq("user_id", user.id);

  const enrollments =
    (data as { status: string; courses: Course }[] | null) ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-extrabold text-secondary">Mi aprendizaje</h1>
      <p className="mt-2 text-base-content/60">
        Continúa donde lo dejaste o explora cursos nuevos.
      </p>

      {enrollments.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {enrollments.map(({ courses: c }) => (
            <div
              key={c.id}
              className="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="card-body">
                <span className="badge badge-primary badge-sm">{c.level}</span>
                <h2 className="card-title text-lg text-secondary">{c.title}</h2>
                <p className="text-sm text-base-content/60">{c.subtitle}</p>
                <div className="card-actions mt-3">
                  <Link
                    href={`/aprender/${c.slug}`}
                    className="btn btn-primary btn-sm btn-block"
                  >
                    <i className="fa-solid fa-play" /> Continuar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-box border border-dashed border-base-300 bg-base-100 p-12 text-center">
          <i className="fa-solid fa-compass mb-3 text-3xl text-primary" />
          <p className="text-base-content/60">
            Aún no estás inscrito en ningún curso.
          </p>
          <Link href="/cursos" className="btn btn-primary mt-4">
            Explorar cursos
          </Link>
        </div>
      )}
    </div>
  );
}
