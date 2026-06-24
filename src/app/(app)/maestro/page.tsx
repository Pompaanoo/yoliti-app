import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { formatPrice } from "@/lib/stripe";
import type { Course } from "@/lib/types";

export const metadata = { title: "Panel de maestro — Yoliti Academy" };

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function createCourse(formData: FormData) {
  "use server";
  const profile = await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const priceMx = Number(formData.get("price") ?? 0);

  await supabase.from("courses").insert({
    title,
    slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`,
    subtitle: String(formData.get("subtitle") ?? ""),
    description: String(formData.get("description") ?? ""),
    level: String(formData.get("level") ?? "principiante"),
    price_cents: Math.round(priceMx * 100),
    currency: "mxn",
    status: String(formData.get("status") ?? "borrador"),
    teacher_id: profile.id,
  });

  revalidatePath("/maestro");
}

export default async function MaestroPage() {
  const profile = await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();

  const query = supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  // El maestro ve los suyos; el super admin ve todos.
  if (profile.role !== "super_admin") {
    query.eq("teacher_id", profile.id);
  }
  const { data } = await query;
  const courses = (data as Course[]) ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-extrabold text-secondary">Panel de maestro</h1>
      <p className="mt-2 text-base-content/60">
        Crea y administra tus cursos.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Lista de cursos */}
        <section>
          <h2 className="font-bold text-secondary">Mis cursos</h2>
          {courses.length > 0 ? (
            <div className="mt-4 overflow-hidden rounded-box border border-base-300">
              <table className="table">
                <thead>
                  <tr>
                    <th>Curso</th>
                    <th>Nivel</th>
                    <th>Precio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id}>
                      <td className="font-medium">{c.title}</td>
                      <td className="capitalize">{c.level}</td>
                      <td>
                        {c.price_cents === 0
                          ? "Gratis"
                          : formatPrice(c.price_cents, c.currency)}
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            c.status === "publicado"
                              ? "badge-success"
                              : c.status === "archivado"
                                ? "badge-ghost"
                                : "badge-warning"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 rounded-box border border-dashed border-base-300 p-8 text-center text-sm text-base-content/50">
              Todavía no has creado cursos. Usa el formulario para empezar.
            </p>
          )}
        </section>

        {/* Formulario crear curso */}
        <section>
          <div className="rounded-box border border-base-300 bg-base-100 p-5">
            <h2 className="font-bold text-secondary">Nuevo curso</h2>
            <form action={createCourse} className="mt-4 space-y-3">
              <input
                name="title"
                required
                placeholder="Título del curso"
                className="input input-bordered input-sm w-full"
              />
              <input
                name="subtitle"
                placeholder="Subtítulo"
                className="input input-bordered input-sm w-full"
              />
              <textarea
                name="description"
                placeholder="Descripción"
                className="textarea textarea-bordered textarea-sm w-full"
              />
              <select
                name="level"
                className="select select-bordered select-sm w-full"
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
              <input
                name="price"
                type="number"
                min="0"
                step="1"
                defaultValue={0}
                placeholder="Precio (MXN, 0 = gratis)"
                className="input input-bordered input-sm w-full"
              />
              <select
                name="status"
                className="select select-bordered select-sm w-full"
              >
                <option value="borrador">Borrador</option>
                <option value="publicado">Publicado</option>
              </select>
              <button className="btn btn-primary btn-sm btn-block">
                <i className="fa-solid fa-plus" /> Crear curso
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
