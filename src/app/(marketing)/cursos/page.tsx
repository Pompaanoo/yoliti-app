import { createClient } from "@/lib/supabase/server";
import CourseCard from "@/components/CourseCard";
import type { Category, Course } from "@/lib/types";

export const metadata = { title: "Cursos — Yoliti Academy" };

export default async function CursosPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("courses")
    .select("*, course_categories(categories(id, name, color))")
    .eq("status", "publicado")
    .order("created_at", { ascending: false });

  type RawCourse = Omit<Course, "categories"> & {
    course_categories: { categories: Category }[];
  };
  const courses: Course[] = ((data as RawCourse[]) ?? []).map((c) => ({
    ...c,
    categories: (c.course_categories ?? []).map((cc) => cc.categories).filter(Boolean),
  }));

  // Categorías únicas presentes en los cursos publicados para filtro
  const seenIds = new Set<string>();
  const usedCategories: Category[] = [];
  for (const c of courses) {
    for (const cat of c.categories ?? []) {
      if (!seenIds.has(cat.id)) {
        seenIds.add(cat.id);
        usedCategories.push(cat);
      }
    }
  }

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

      {/* Filtros por categoría */}
      {usedCategories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {usedCategories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: cat.color }}
            >
              <i className="fa-solid fa-tag text-[10px]" />
              {cat.name}
            </span>
          ))}
        </div>
      )}

      {courses.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-box border border-dashed border-base-300 p-16 text-center text-base-content/50">
          <i className="fa-solid fa-book-open mb-3 text-3xl" />
          <p>
            No hay cursos publicados todavía.
          </p>
        </div>
      )}
    </div>
  );
}
