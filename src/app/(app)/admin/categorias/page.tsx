import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { createCategory } from "@/lib/server-actions";
import type { Category } from "@/lib/types";
import { CategoryRow } from "./CategoryRow";

export const metadata = { title: "Categorías — Yoliti Academy" };

const COLOR_VALUES = [
  { key: "indigo",  value: "#6366f1" },
  { key: "violet",  value: "#8b5cf6" },
  { key: "pink",    value: "#ec4899" },
  { key: "red",     value: "#ef4444" },
  { key: "orange",  value: "#f97316" },
  { key: "yellow",  value: "#eab308" },
  { key: "green",   value: "#22c55e" },
  { key: "cyan",    value: "#06b6d4" },
  { key: "blue",    value: "#3b82f6" },
  { key: "gray",    value: "#6b7280" },
] as const;

export default async function CategoriasPage() {
  const [, t, tc] = await Promise.all([
    requireRole("super_admin"),
    getTranslations("adminCategorias"),
    getTranslations("colors"),
  ]);
  const supabase = await createClient();

  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  const categories = (data as Category[]) ?? [];

  // Conteo de cursos por categoría
  const { data: counts } = await supabase
    .from("course_categories")
    .select("category_id");
  const courseCount: Record<string, number> = {};
  for (const c of counts ?? []) {
    courseCount[c.category_id] = (courseCount[c.category_id] ?? 0) + 1;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-secondary">{t("title")}</h1>
        <p className="mt-1 text-sm text-base-content/60">{t("subtitle")}</p>
      </div>

      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-secondary">{t("newCategory")}</h2>
        <form action={createCategory} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="label label-text pb-1 text-xs font-medium">{t("nameLabel")}</label>
            <input
              name="name"
              required
              placeholder={t("namePlaceholder")}
              className="input input-bordered input-sm w-full"
            />
          </div>
          <div>
            <label className="label label-text pb-1 text-xs font-medium">{t("colorLabel")}</label>
            <select name="color" className="select select-bordered select-sm w-40">
              {COLOR_VALUES.map((c) => (
                <option key={c.value} value={c.value}>
                  {tc(c.key)}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-sm">
            <i className="fa-solid fa-plus" /> {t("createBtn")}
          </button>
        </form>
      </section>

      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-secondary">{t("existingTitle")}</h2>
          <span className="badge badge-ghost">{categories.length}</span>
        </div>

        {categories.length === 0 ? (
          <p className="p-8 text-center text-sm text-base-content/40">{t("empty")}</p>
        ) : (
          <ul className="divide-y divide-base-200">
            {categories.map((cat) => (
              <CategoryRow
                key={`${cat.id}-${cat.color}`}
                cat={cat}
                courseCount={courseCount[cat.id] ?? 0}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
