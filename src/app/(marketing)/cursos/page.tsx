import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";
import type { Course } from "@/lib/types";

export const metadata = { title: "Cursos — Yoliti Academy" };

export default async function CursosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "publicado")
    .order("created_at", { ascending: false });

  const courses = (data as Course[]) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold text-secondary">
          Catálogo de cursos
        </h1>
        <p className="mt-3 text-base-content/60">
          Explora nuestros programas y empieza a aprender a tu ritmo.
        </p>
      </header>

      {courses.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-box border border-dashed border-base-300 p-16 text-center text-base-content/50">
          <i className="fa-solid fa-book-open mb-3 text-3xl" />
          <p>
            No hay cursos publicados todavía. Conecta tu proyecto de Supabase y
            crea cursos desde el panel de maestro.
          </p>
        </div>
      )}
    </div>
  );
}
