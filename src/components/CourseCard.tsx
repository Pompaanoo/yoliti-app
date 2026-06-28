"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Course } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const LEVEL_STYLES: Record<string, string> = {
  principiante: "badge-success text-white",
  intermedio: "badge-warning text-white",
  avanzado: "badge-error text-white",
};

export default function CourseCard({ course }: { course: Course }) {
  const t = useTranslations("common");
  const tl = useTranslations("levels");
  return (
    <Link
      href={`/cursos/${course.slug}`}
      className="group card h-full overflow-hidden border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <figure className="hero-gradient relative h-40">
        {course.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.cover_url}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <i className="fa-solid fa-book-open text-5xl text-white/80" />
        )}
      </figure>
      <div className="card-body flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`badge ${LEVEL_STYLES[course.level]} badge-sm`}>
            {tl(course.level)}
          </span>
          {course.categories?.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </span>
          ))}
        </div>
        <h3 className="card-title text-lg leading-snug group-hover:text-primary">
          {course.title}
        </h3>
        <p className="min-h-[1.25rem] text-sm text-base-content/60">
          {course.subtitle ?? ""}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-secondary">
            {course.price_cents === 0
              ? t("free")
              : formatPrice(course.price_cents, course.currency)}
          </span>
          <span className="text-sm font-medium text-primary">
            {t("viewCourse")} <i className="fa-solid fa-arrow-right" />
          </span>
        </div>
      </div>
    </Link>
  );
}
