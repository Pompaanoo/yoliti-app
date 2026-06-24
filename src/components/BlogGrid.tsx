"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CATEGORY_BADGE,
  CATEGORY_LABEL,
  type BlogCategory,
} from "@/lib/blog";

export interface BlogCardData {
  slug: string;
  title: string;
  category: BlogCategory;
  image: string;
  excerpt: string;
  date: string;
  readMin: number;
}

const TABS: { key: "all" | BlogCategory; label: string }[] = [
  { key: "all", label: "Todos los temas" },
  { key: "practice", label: CATEGORY_LABEL.practice },
  { key: "self", label: CATEGORY_LABEL.self },
  { key: "trauma", label: CATEGORY_LABEL.trauma },
];

export default function BlogGrid({ posts }: { posts: BlogCardData[] }) {
  const [filter, setFilter] = useState<"all" | BlogCategory>("all");
  const visible =
    filter === "all" ? posts : posts.filter((p) => p.category === filter);

  return (
    <div>
      {/* Tabs de categoría */}
      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`btn btn-sm rounded-full ${
              filter === t.key
                ? "btn-primary"
                : "btn-ghost border border-base-300 text-base-content/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Rejilla */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group card overflow-hidden border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <figure className="h-44 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </figure>
            <div className="card-body gap-2 p-5">
              <span
                className={`badge badge-sm w-fit border-0 font-medium ${CATEGORY_BADGE[p.category]}`}
              >
                {CATEGORY_LABEL[p.category]}
              </span>
              <h3 className="text-sm font-bold leading-snug text-secondary group-hover:text-primary">
                {p.title}
              </h3>
              <p className="line-clamp-2 text-xs text-base-content/50">
                {p.excerpt}
              </p>
              <p className="mt-1 text-xs text-base-content/30">
                {p.date} · {p.readMin} min
              </p>
            </div>
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="py-12 text-center text-base-content/50">
          No hay artículos en esta categoría.
        </p>
      )}
    </div>
  );
}
