import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";
import type { Course } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "publicado")
    .order("created_at", { ascending: false })
    .limit(3);

  const courses = (data as Course[]) ?? [];

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-24 md:grid-cols-2 md:items-center">
          <div>
            <span className="badge badge-lg border-white/30 bg-white/10 text-white">
              <i className="fa-solid fa-sparkles mr-2" /> Aprendizaje con propósito
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl">
              Crece como profesional y como persona
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/80">
              Cursos de bienestar, inteligencia emocional y comunicación clínica
              diseñados para profesionales de habla hispana.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cursos" className="btn btn-accent btn-lg">
                Explorar cursos
              </Link>
              <Link
                href="/registro"
                className="btn btn-lg border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                Crear cuenta gratis
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="rounded-box border border-white/20 bg-white/10 p-6 backdrop-blur">
              <div className="space-y-4">
                {[
                  ["fa-heart-pulse", "Comunicación clínica"],
                  ["fa-brain", "Inteligencia emocional"],
                  ["fa-seedling", "Bienestar y autocuidado"],
                ].map(([icon, label]) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 rounded-xl bg-white/10 p-4"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/20">
                      <i className={`fa-solid ${icon} text-xl`} />
                    </span>
                    <span className="font-semibold">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos destacados */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-secondary">
              Cursos destacados
            </h2>
            <p className="mt-2 text-base-content/60">
              Empieza tu camino de aprendizaje hoy.
            </p>
          </div>
          <Link href="/cursos" className="btn btn-ghost btn-sm">
            Ver todos <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-box border border-dashed border-base-300 p-12 text-center text-base-content/50">
            Aún no hay cursos publicados. Conecta Supabase y crea el primero
            desde el <Link href="/maestro" className="link link-primary">panel de maestro</Link>.
          </div>
        )}
      </section>

      {/* Bloque de valores */}
      <section className="bg-base-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 md:grid-cols-3">
          {[
            ["fa-circle-check", "Contenido práctico", "Lecciones aplicables desde el primer día."],
            ["fa-user-graduate", "Maestros expertos", "Aprende con especialistas certificados."],
            ["fa-infinity", "Acceso de por vida", "Tu progreso, siempre disponible."],
          ].map(([icon, title, desc]) => (
            <div key={title} className="text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <i className={`fa-solid ${icon} text-2xl`} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-secondary">{title}</h3>
              <p className="mt-2 text-sm text-base-content/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
