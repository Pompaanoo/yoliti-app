import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { STATUS_BADGE } from "@/lib/course-status";
import { GroupSettingsForm } from "./GroupSettingsForm";
import { requireRole } from "@/lib/auth";
import {
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
  const [, t, ts] = await Promise.all([
    requireRole(["maestro", "super_admin"]),
    getTranslations("editGrupo"),
    getTranslations("status"),
  ]);
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

      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-secondary">{t("groupData")}</h2>
        <GroupSettingsForm group={group} />
      </section>

      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-secondary">
          {t("students")}{" "}
          <span className="badge badge-primary ml-1">{group.group_students.length}</span>
        </h2>

        {availableStudents.length > 0 ? (
          <form action={addStudentToGroup} className="mb-5 flex gap-2">
            <input type="hidden" name="group_id" value={id} />
            <select name="user_id" className="select select-sm flex-1" defaultValue="">
              <option value="" disabled>{t("selectStudent")}</option>
              {availableStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name ? `${s.full_name} — ${s.email}` : s.email}
                </option>
              ))}
            </select>
            <button className="btn btn-primary btn-sm">
              <i className="fa-solid fa-user-plus" /> {t("add")}
            </button>
          </form>
        ) : (
          <p className="mb-5 text-sm text-base-content/40">
            {memberIds.size === 0
              ? t("noStudentsAvailable")
              : t("allStudentsInGroup")}
          </p>
        )}

        {group.group_students.length === 0 ? (
          <p className="text-sm text-base-content/50">{t("noStudentsInGroup")}</p>
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
                      <p className="text-sm font-medium">{p?.full_name || t("noName")}</p>
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

      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-secondary">
          {t("assignedCourses")}{" "}
          <span className="badge badge-primary ml-1">{group.group_courses.length}</span>
        </h2>

        <form action={addCourseToGroup} className="mb-5 flex gap-2">
          <input type="hidden" name="group_id" value={id} />
          <select name="course_id" className="select select-sm flex-1" defaultValue="">
            <option value="" disabled>{t("selectCourse")}</option>
            {availableCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}{c.status === "borrador" ? ` ${t("draftLabel")}` : ""}
              </option>
            ))}
          </select>
          <button className="btn btn-primary btn-sm">
            <i className="fa-solid fa-plus" /> {t("add")}
          </button>
        </form>

        {group.group_courses.length === 0 ? (
          <p className="text-sm text-base-content/50">{t("noCourses")}</p>
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
                      <span className={`badge badge-xs capitalize ${STATUS_BADGE[c?.status ?? ""] ?? "badge-ghost"}`}>
                        {c?.status ? ts(c.status) : ""}
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
