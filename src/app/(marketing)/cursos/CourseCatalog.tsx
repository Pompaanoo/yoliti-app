"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import CourseCard from "@/components/CourseCard";
import type { Category, Course } from "@/lib/types";

interface Props {
  courses: Course[];
  categories: Category[];
}

export function CourseCatalog({ courses, categories }: Props) {
  const t = useTranslations("course");
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setActiveIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function getSortGroup(course: Course): number {
    const cats = course.categories ?? [];
    const matchCount = cats.filter((cat) => activeIds.has(cat.id)).length;
    if (matchCount === 0) return 3; // no match → last, dimmed

    if (activeIds.size === 1) {
      // 1 filtro: exclusivo (solo esa categoría) → primero; multi-categoría → segundo
      return cats.length === 1 ? 1 : 2;
    }

    // 2+ filtros: coincide con todos → primero; coincide con alguno → segundo
    return matchCount === activeIds.size ? 1 : 2;
  }

  const sorted = activeIds.size === 0
    ? courses
    : [...courses].sort((a, b) => getSortGroup(a) - getSortGroup(b));

  return (
    <>
      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveIds(new Set())}
            className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-medium transition-all ${
              activeIds.size === 0
                ? "border-secondary bg-secondary text-white"
                : "border-base-300 bg-base-100 text-base-content/70 hover:border-base-400"
            }`}
          >
            {t("allCategories")}
          </button>

          {categories.map((cat) => {
            const isActive = activeIds.has(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                className="inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-medium transition-all"
                style={
                  isActive
                    ? { backgroundColor: cat.color, borderColor: cat.color, color: "white" }
                    : { borderColor: cat.color, color: cat.color, backgroundColor: "transparent" }
                }
              >
                <i className="fa-solid fa-tag text-[10px]" />
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      {sorted.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((c) => {
            const matchCount = activeIds.size > 0
              ? (c.categories?.filter((cat) => activeIds.has(cat.id)).length ?? 0)
              : null;
            const dimmed = matchCount !== null && matchCount === 0;
            return (
              <div
                key={c.id}
                className={`transition-opacity duration-200 ${dimmed ? "opacity-35" : "opacity-100"}`}
              >
                <CourseCard course={c} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-12 rounded-box border border-dashed border-base-300 p-16 text-center text-base-content/50">
          <i className="fa-solid fa-book-open mb-3 text-3xl" />
          <p>{t("emptyCatalog")}</p>
        </div>
      )}
    </>
  );
}
