import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import type { Profile, UserRole } from "@/lib/types";

export const metadata = { title: "Administración — Yoliti Academy" };

async function changeRole(formData: FormData) {
  "use server";
  await requireRole("super_admin");
  const supabase = await createClient();

  const userId = String(formData.get("userId"));
  const role = String(formData.get("role")) as UserRole;

  await supabase.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/admin");
}

export default async function AdminPage() {
  await requireRole("super_admin");
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const { count: courseCount } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  const { count: enrollCount } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true });

  const users = (profiles as Profile[]) ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-extrabold text-secondary">Administración</h1>
      <p className="mt-2 text-base-content/60">
        Gestiona usuarios, roles y supervisa la plataforma.
      </p>

      {/* Métricas */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["fa-users", "Usuarios", users.length],
          ["fa-book", "Cursos", courseCount ?? 0],
          ["fa-user-check", "Inscripciones", enrollCount ?? 0],
        ].map(([icon, label, value]) => (
          <div
            key={label as string}
            className="rounded-box border border-base-300 bg-base-100 p-5"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <i className={`fa-solid ${icon} text-lg`} />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-secondary">{value}</p>
                <p className="text-xs text-base-content/50">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usuarios y roles */}
      <section className="mt-10">
        <h2 className="font-bold text-secondary">Usuarios y roles</h2>
        <div className="mt-4 overflow-x-auto rounded-box border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol actual</th>
                <th>Cambiar rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-content text-xs font-bold">
                        {(u.full_name || "U").charAt(0).toUpperCase()}
                      </span>
                      <span className="font-medium">
                        {u.full_name || "Sin nombre"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-ghost capitalize">
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <form action={changeRole} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={u.id} />
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="select select-bordered select-xs"
                      >
                        <option value="alumno">Alumno</option>
                        <option value="maestro">Maestro</option>
                        <option value="super_admin">Super admin</option>
                      </select>
                      <button className="btn btn-primary btn-xs">Guardar</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
