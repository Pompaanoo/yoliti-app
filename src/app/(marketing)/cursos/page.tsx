import { getTranslations, getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import type { Category, Course } from "@/lib/types";
import { CourseCatalog } from "./CourseCatalog";

export const metadata = { title: "Cursos — Yoliti Academy" };

export default async function CursosPage() {
  const [tc, locale, supabase] = await Promise.all([
    getTranslations("course"),
    getLocale(),
    createClient(),
  ]);

  const { data } = await supabase
    .from("courses")
    .select("*, course_categories(categories(id, name, name_en, color, slug, created_at))")
    .eq("status", "publicado")
    .order("created_at", { ascending: false });

  type RawCourse = Omit<Course, "categories"> & {
    course_categories: { categories: Category }[];
  };
  const en = locale === "en";

  function translateCat(cat: Category): Category {
    return en && cat.name_en ? { ...cat, name: cat.name_en } : cat;
  }

  const courses: Course[] = ((data as RawCourse[]) ?? []).map((c) => ({
    ...c,
    title: (en && c.title_en) || c.title,
    subtitle: (en && c.subtitle_en) || c.subtitle,
    categories: (c.course_categories ?? []).map((cc) => translateCat(cc.categories)).filter(Boolean),
  }));

  const seenIds = new Set<string>();
  const usedCategories: Category[] = [];
  for (const c of courses) {
    for (const cat of c.categories ?? []) {
      if (!seenIds.has(cat.id)) {
        seenIds.add(cat.id);
        usedCategories.push(cat); // already translated via translateCat above
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-extrabold text-secondary">
          {tc("catalogTitle")}
        </h1>
        <p className="mt-3 text-base-content/60">
          {tc("catalogDesc")}
        </p>
      </header>

      <CourseCatalog courses={courses} categories={usedCategories} />
    </div>
  );
}
