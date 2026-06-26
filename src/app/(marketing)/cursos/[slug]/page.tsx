import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import EnrollButton from "@/components/EnrollButton";
import type { Course, Lesson, Module } from "@/lib/types";

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!course) notFound();
  const c = course as Course;

  const { data: modulesData } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", c.id)
    .order("position");

  const modules = (modulesData as ModuleWithLessons[]) ?? [];
  const lessonCount = modules.reduce(
    (n, m) => n + (m.lessons?.length ?? 0),
    0
  );

  const user = await getUser();
  let enrolled = false;
  if (user) {
    const { data: enr } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", c.id)
      .maybeSingle();
    enrolled = Boolean(enr);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        {/* Contenido */}
        <div className="lg:col-span-2">
          <div className="hero-gradient flex h-56 items-center justify-center rounded-box text-white">
            {c.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.cover_url}
                alt={c.title}
                className="h-full w-full rounded-box object-cover"
              />
            ) : (
              <i className="fa-solid fa-graduation-cap text-6xl text-white/80" />
            )}
          </div>

          <span className="badge badge-primary mt-6 capitalize text-white">{c.level}</span>
          <h1 className="mt-3 text-4xl font-extrabold text-secondary">
            {c.title}
          </h1>
          {c.subtitle && (
            <p className="mt-2 text-lg text-base-content/70">{c.subtitle}</p>
          )}

          {c.description && (
            <div className="prose mt-8 max-w-none text-base-content/80">
              <h2 className="text-xl font-bold text-secondary">
                Sobre este curso
              </h2>
              <p>{c.description}</p>
            </div>
          )}

          {/* Temario */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-secondary">
              Contenido del curso
            </h2>
            <p className="text-sm text-base-content/50">
              {modules.length} módulos · {lessonCount} lecciones
            </p>
            <div className="mt-4 space-y-3">
              {modules.length === 0 && (
                <p className="rounded-box border border-dashed border-base-300 p-6 text-sm text-base-content/50">
                  El temario se mostrará aquí cuando el maestro agregue módulos.
                </p>
              )}
              {modules.map((m, i) => {
                const locked = (m.lessons ?? []).length === 0;
                return (
                  <div
                    key={m.id}
                    className={`collapse collapse-arrow border border-base-300 ${
                      locked ? "bg-base-200" : "bg-base-100"
                    }`}
                  >
                    <input type="checkbox" defaultChecked={i === 0 && !locked} />
                    <div className="collapse-title flex items-center gap-2 font-semibold">
                      {locked && (
                        <i className="fa-solid fa-lock text-sm text-base-content/40" />
                      )}
                      <span className={locked ? "text-base-content/60" : ""}>
                        Módulo {i + 1}: {m.title}
                      </span>
                    </div>
                    <div className="collapse-content">
                      {locked ? (
                        <div className="flex items-start gap-3 rounded-lg bg-base-100 p-3 text-sm text-base-content/60">
                          <i className="fa-solid fa-crown mt-0.5 text-accent" />
                          <span>
                            Contenido exclusivo para miembros. Inscríbete en el
                            curso para desbloquear este módulo.
                          </span>
                        </div>
                      ) : (
                        <ul className="space-y-2">
                          {(m.lessons ?? [])
                            .sort((a, b) => a.position - b.position)
                            .map((l) => (
                              <li
                                key={l.id}
                                className="flex items-center gap-3 text-sm text-base-content/70"
                              >
                                <i className="fa-solid fa-circle-play text-primary" />
                                {l.title}
                                {l.duration_minutes && (
                                  <span className="ml-auto text-xs text-base-content/40">
                                    {l.duration_minutes} min
                                  </span>
                                )}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar de compra */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-box border border-base-300 bg-base-100 p-6 shadow-lg">
            <div className="text-3xl font-extrabold text-secondary">
              {c.price_cents === 0
                ? "Gratis"
                : formatPrice(c.price_cents, c.currency)}
            </div>
            <div className="mt-6">
              <EnrollButton
                courseId={c.id}
                courseSlug={c.slug}
                isFree={c.price_cents === 0}
                isLoggedIn={Boolean(user)}
                alreadyEnrolled={enrolled}
              />
            </div>
            <ul className="mt-6 space-y-3 text-sm text-base-content/70">
              <li><i className="fa-solid fa-check text-primary" /> Acceso de por vida</li>
              <li><i className="fa-solid fa-check text-primary" /> Certificado al completar</li>
              <li><i className="fa-solid fa-check text-primary" /> Aprende a tu ritmo</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
