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
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = activeId
    ? courses.filter((c) => c.categories?.some((cat) => cat.id === activeId))
    : courses;

  function toggle(id: string) {
    setActiveId((prev) => (prev === id ? null : id));
  }

  return (
    <>
      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveId(null)}
            className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-medium transition-all ${
              activeId === null
                ? "border-secondary bg-secondary text-white"
                : "border-base-300 bg-base-100 text-base-content/70 hover:border-base-400"
            }`}
          >
            {t("allCategories")}
          </button>

          {categories.map((cat) => {
            const isActive = activeId === cat.id;
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

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
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
