import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import {
  updateGroup,
  addStudentToGroup,
  removeStudentFromGroup,
  addCourseToGroup,
  removeCourseFromGroup,
} from "@/lib/server-actions";
import type { Course, GroupWithDetails, Profile } from "@/lib/types";

export const metadata = { title: "Editar grupo — Yoliti Academy" };

export default async function EditGrupoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();

  const { data: groupRaw } = await supabase
    .from("groups")
    .select(
      "*, group_students(user_id, added_at, profiles(id, full_name, avatar_url, role, created_at)), group_courses(course_id, assigned_at, courses(*))"
    )
    .eq("id", id)
    .single();

  if (!groupRaw) notFound();
  const group = groupRaw as GroupWithDetails;

  // Todos los cursos disponibles (para asignar)
  const { data: allCoursesRaw } = await supabase
    .from("courses")
    .select("id, title, status")
    .order("title");
  const allCourses = (allCoursesRaw as Pick<Course, "id" | "title" | "status">[]) ?? [];

  const assignedCourseIds = new Set(group.group_courses.map((gc) => gc.course_id));
  const availableCourses = allCourses.filter((c) => !assignedCourseIds.has(c.id));

  // Alumnos disponibles para agregar (todos los perfiles con rol alumno no ya en el grupo)
  const admin = createAdminClient();
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const { data: allProfilesRaw } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("role", "alumno")
    .order("full_name");
  const allProfiles = (allProfilesRaw as Pick<Profile, "id" | "full_name" | "role">[]) ?? [];

  const memberIds = new Set(group.group_students.map((gs) => gs.user_id));
  const availableStudents = allProfiles
    .filter((p) => !memberIds.has(p.id))
    .map((p) => {
      const authUser = authUsers?.find((u: { id: string; email?: string }) => u.id === p.id);
      return { ...p, email: authUser?.email ?? "" };
    });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/grupos" className="btn btn-ghost btn-sm">
          <i className="fa-solid fa-arrow-left" />
        </Link>
        <h1 className="text-2xl font-extrabold text-secondary">{group.name}</h1>
      </div>

      {/* Datos del grupo */}
      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-secondary">Datos del grupo</h2>
        <form action={updateGroup} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={id} />
          <div className="sm:col-span-2">
            <label htmlFor="name" className="mb-1 block text-sm font-medium">Nombre</label>
            <input
              id="name"
              name="name"
              defaultValue={group.name}
              required
              className="input w-full"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="mb-1 block text-sm font-medium">Descripción</label>
            <textarea
              id="description"
              name="description"
              defaultValue={group.description ?? ""}
              className="textarea h-24 w-full"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="image_url" className="mb-1 block text-sm font-medium">URL de imagen</label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={group.image_url ?? ""}
              className="input w-full"
              placeholder="https://..."
            />
          </div>
          {group.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={group.image_url}
              alt=""
              className="sm:col-span-2 h-40 w-full rounded-box object-cover"
            />
          )}
          <div className="sm:col-span-2">
            <button className="btn btn-primary">
              <i className="fa-solid fa-floppy-disk" /> Guardar cambios
            </button>
          </div>
        </form>
      </section>

      {/* Alumnos */}
      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-secondary">
          Alumnos{" "}
          <span className="badge badge-primary ml-1">{group.group_students.length}</span>
        </h2>

        {/* Agregar alumno */}
        {availableStudents.length > 0 ? (
          <form action={addStudentToGroup} className="mb-5 flex gap-2">
            <input type="hidden" name="group_id" value={id} />
            <select name="user_id" className="select select-sm flex-1" defaultValue="">
              <option value="" disabled>Selecciona un alumno…</option>
              {availableStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name ? `${s.full_name} — ${s.email}` : s.email}
                </option>
              ))}
            </select>
            <button className="btn btn-primary btn-sm">
              <i className="fa-solid fa-user-plus" /> Agregar
            </button>
          </form>
        ) : (
          <p className="mb-5 text-sm text-base-content/40">
            {memberIds.size === 0
              ? "No hay alumnos registrados en la plataforma todavía."
              : "Todos los alumnos registrados ya están en este grupo."}
          </p>
        )}

        {group.group_students.length === 0 ? (
          <p className="text-sm text-base-content/50">No hay alumnos en este grupo.</p>
        ) : (
          <ul className="divide-y divide-base-200">
            {group.group_students.map((gs) => {
              const p = gs.profiles;
              return (
                <li key={gs.user_id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-content text-xs font-bold">
                      {(p?.full_name || "?").charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{p?.full_name || "Sin nombre"}</p>
                      <p className="text-xs capitalize text-base-content/40">{p?.role}</p>
                    </div>
                  </div>
                  <form action={removeStudentFromGroup}>
                    <input type="hidden" name="group_id" value={id} />
                    <input type="hidden" name="user_id" value={gs.user_id} />
                    <button className="btn btn-ghost btn-xs text-error">
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Cursos */}
      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-secondary">
          Cursos asignados{" "}
          <span className="badge badge-primary ml-1">{group.group_courses.length}</span>
        </h2>

        {/* Agregar curso */}
        <form action={addCourseToGroup} className="mb-5 flex gap-2">
          <input type="hidden" name="group_id" value={id} />
          <select name="course_id" className="select select-sm flex-1" defaultValue="">
            <option value="" disabled>Selecciona un curso…</option>
            {availableCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}{" "}
                {c.status === "borrador" ? "(borrador)" : ""}
              </option>
            ))}
          </select>
          <button className="btn btn-primary btn-sm">
            <i className="fa-solid fa-plus" /> Agregar
          </button>
        </form>

        {group.group_courses.length === 0 ? (
          <p className="text-sm text-base-content/50">No hay cursos asignados.</p>
        ) : (
          <ul className="divide-y divide-base-200">
            {group.group_courses.map((gc) => {
              const c = gc.courses;
              return (
                <li key={gc.course_id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                      <i className="fa-solid fa-book text-xs" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{c?.title}</p>
                      <span
                        className={`badge badge-xs capitalize text-white ${
                          c?.status === "publicado" ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {c?.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/cursos/${c?.id}`}
                      className="btn btn-ghost btn-xs"
                    >
                      <i className="fa-solid fa-pen" />
                    </Link>
                    <form action={removeCourseFromGroup}>
                      <input type="hidden" name="group_id" value={id} />
                      <input type="hidden" name="course_id" value={gc.course_id} />
                      <button className="btn btn-ghost btn-xs text-error">
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
