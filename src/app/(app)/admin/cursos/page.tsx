import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import type { Course } from "@/lib/types";

export const metadata = { title: "Gestión de cursos — Yoliti Academy" };

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
  revalidatePath("/admin/cursos");
}

export default async function CursosAdminPage() {
  const profile = await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();

  const query = supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (profile.role !== "super_admin") {
    query.eq("teacher_id", profile.id);
  }

  const { data } = await query;
  const courses = (data as Course[]) ?? [];

  const STATUS_BADGE: Record<string, string> = {
    publicado: "badge-success text-white",
    borrador: "badge-warning text-white",
    archivado: "badge-ghost",
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-extrabold text-secondary">Gestión de cursos</h1>
      <p className="mt-1 text-sm text-base-content/60">
        Crea y edita cursos con módulos y capítulos interactivos.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Lista */}
        <section>
          {courses.length === 0 ? (
            <div className="rounded-box border border-dashed border-base-300 p-12 text-center text-sm text-base-content/50">
              Sin cursos todavía. Crea el primero.
            </div>
          ) : (
            <div className="overflow-hidden rounded-box border border-base-300 bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th>Curso</th>
                    <th>Nivel</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id} className="hover">
                      <td className="font-medium">{c.title}</td>
                      <td className="capitalize text-sm text-base-content/60">{c.level}</td>
                      <td className="text-sm">
                        {c.price_cents === 0
                          ? "Gratis"
                          : formatPrice(c.price_cents, c.currency)}
                      </td>
                      <td>
                        <span className={`badge badge-sm capitalize ${STATUS_BADGE[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/admin/cursos/${c.id}`}
                          className="btn btn-primary btn-xs"
                        >
                          <i className="fa-solid fa-pen" /> Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Crear curso */}
        <section>
          <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-secondary">Nuevo curso</h2>
            <form action={createCourse} className="space-y-3">
              <div>
                <label htmlFor="title" className="mb-1 block text-sm font-medium">Título *</label>
                <input id="title" name="title" required className="input input-sm w-full" />
              </div>
              <div>
                <label htmlFor="subtitle" className="mb-1 block text-sm font-medium">Subtítulo</label>
                <input id="subtitle" name="subtitle" className="input input-sm w-full" />
              </div>
              <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium">Descripción</label>
                <textarea id="description" name="description" className="textarea textarea-sm w-full" />
              </div>
              <div>
                <label htmlFor="level" className="mb-1 block text-sm font-medium">Nivel</label>
                <select id="level" name="level" className="select select-sm w-full">
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
              <div>
                <label htmlFor="price" className="mb-1 block text-sm font-medium">Precio MXN (0 = gratis)</label>
                <input id="price" name="price" type="number" min="0" step="1" defaultValue={0} className="input input-sm w-full" />
              </div>
              <div>
                <label htmlFor="status" className="mb-1 block text-sm font-medium">Estado</label>
                <select id="status" name="status" className="select select-sm w-full">
                  <option value="borrador">Borrador</option>
                  <option value="publicado">Publicado</option>
                </select>
              </div>
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
