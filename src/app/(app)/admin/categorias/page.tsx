import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { createCategory } from "@/lib/server-actions";
import type { Category } from "@/lib/types";
import { CategoryRow } from "./CategoryRow";

export const metadata = { title: "Categorías — Yoliti Academy" };

const PRESET_COLORS = [
  { label: "Índigo",    value: "#6366f1" },
  { label: "Violeta",   value: "#8b5cf6" },
  { label: "Rosa",      value: "#ec4899" },
  { label: "Rojo",      value: "#ef4444" },
  { label: "Naranja",   value: "#f97316" },
  { label: "Amarillo",  value: "#eab308" },
  { label: "Verde",     value: "#22c55e" },
  { label: "Cian",      value: "#06b6d4" },
  { label: "Azul",      value: "#3b82f6" },
  { label: "Gris",      value: "#6b7280" },
];

export default async function CategoriasPage() {
  await requireRole("super_admin");
  const supabase = await createClient();

  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  const categories = (data as Category[]) ?? [];

  // Conteo de cursos por categoría
  const { data: counts } = await supabase
    .from("courses")
    .select("category_id")
    .not("category_id", "is", null);
  const courseCount: Record<string, number> = {};
  for (const c of counts ?? []) {
    if (c.category_id) courseCount[c.category_id] = (courseCount[c.category_id] ?? 0) + 1;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-secondary">Categorías</h1>
        <p className="mt-1 text-sm text-base-content/60">
          Clasificaciones que se pueden asignar a los cursos.
        </p>
      </div>

      {/* Crear nueva */}
      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-secondary">Nueva categoría</h2>
        <form action={createCategory} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="label label-text pb-1 text-xs font-medium">Nombre</label>
            <input
              name="name"
              required
              placeholder="Ej: Desarrollo web"
              className="input input-bordered input-sm w-full"
            />
          </div>
          <div>
            <label className="label label-text pb-1 text-xs font-medium">Color</label>
            <select name="color" className="select select-bordered select-sm w-40">
              {PRESET_COLORS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary btn-sm">
            <i className="fa-solid fa-plus" /> Crear
          </button>
        </form>
      </section>

      {/* Lista */}
      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-secondary">Clasificaciones existentes</h2>
          <span className="badge badge-ghost">{categories.length}</span>
        </div>

        {categories.length === 0 ? (
          <p className="p-8 text-center text-sm text-base-content/40">
            No hay categorías todavía. Crea la primera arriba.
          </p>
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
