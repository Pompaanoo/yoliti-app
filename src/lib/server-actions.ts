"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser, requireRole } from "@/lib/auth";

// ─── Progreso ─────────────────────────────────────────────────

export async function markLessonProgress(
  lessonId: string,
  pct: number
) {
  const user = await requireUser();
  const supabase = await createClient();
  await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      completed: pct >= 100,
      completed_at: pct >= 100 ? new Date().toISOString() : null,
      progress_pct: pct,
    },
    { onConflict: "user_id,lesson_id" }
  );
}

// ─── Módulos ──────────────────────────────────────────────────

export async function createModule(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const courseId = String(formData.get("course_id"));
  const title = String(formData.get("title")).trim();
  if (!title || !courseId) return;

  const { data: last } = await supabase
    .from("modules")
    .select("position")
    .eq("course_id", courseId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase.from("modules").insert({
    course_id: courseId,
    title,
    position: (last?.position ?? -1) + 1,
  });
  revalidatePath(`/admin/cursos/${courseId}`);
}

export async function updateModule(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const title = String(formData.get("title")).trim();
  const courseId = String(formData.get("course_id"));
  if (!id || !title) return;
  await supabase.from("modules").update({ title }).eq("id", id);
  revalidatePath(`/admin/cursos/${courseId}`);
}

export async function deleteModule(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const courseId = String(formData.get("course_id"));
  await supabase.from("modules").delete().eq("id", id);
  revalidatePath(`/admin/cursos/${courseId}`);
}

// ─── Capítulos / Lecciones ────────────────────────────────────

export async function createLesson(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const moduleId = String(formData.get("module_id"));
  const courseId = String(formData.get("course_id"));
  const title = String(formData.get("title")).trim();
  const contentType = String(formData.get("content_type") ?? "video");
  if (!title || !moduleId) return;

  const { data: last } = await supabase
    .from("lessons")
    .select("position")
    .eq("module_id", moduleId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("lessons").insert({
    module_id: moduleId,
    title,
    content_type: contentType,
    position: (last?.position ?? -1) + 1,
  });

  if (error) {
    console.error("[createLesson] Supabase error:", error.message, error.details);
    return;
  }

  revalidatePath(`/admin/cursos/${courseId}`);
}

export async function deleteLesson(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const courseId = String(formData.get("course_id"));
  await supabase.from("lessons").delete().eq("id", id);
  revalidatePath(`/admin/cursos/${courseId}`);
}

export async function saveChapterContent(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const title = String(formData.get("title")).trim();
  const contentType = String(formData.get("content_type"));
  const contentDataRaw = String(formData.get("content_data_json") ?? "{}");

  let contentData: Record<string, unknown> = {};
  try {
    contentData = JSON.parse(contentDataRaw);
  } catch {
    contentData = {};
  }

  await supabase
    .from("lessons")
    .update({ title, content_type: contentType, content_data: contentData })
    .eq("id", id);

  revalidatePath(`/admin/capitulos/${id}`);
}

// ─── Grupos ───────────────────────────────────────────────────

export async function createGroup(formData: FormData) {
  const profile = await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const name = String(formData.get("name")).trim();
  if (!name) return;

  await supabase.from("groups").insert({
    name,
    description: String(formData.get("description") ?? ""),
    image_url: String(formData.get("image_url") ?? "") || null,
    teacher_id: profile.id,
  });
  revalidatePath("/admin/grupos");
}

export async function updateGroup(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id"));
  await supabase
    .from("groups")
    .update({
      name: String(formData.get("name")).trim(),
      description: String(formData.get("description") ?? ""),
      image_url: String(formData.get("image_url") ?? "") || null,
    })
    .eq("id", id);
  revalidatePath(`/admin/grupos/${id}`);
}

export async function deleteGroup(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id"));
  await supabase.from("groups").delete().eq("id", id);
  revalidatePath("/admin/grupos");
}

export async function addStudentToGroup(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const groupId = String(formData.get("group_id"));
  const email = String(formData.get("email")).trim().toLowerCase();
  if (!email) return;

  // Buscar usuario por email en auth.users via admin client
  const { createAdminClient } = await import("@/lib/supabase/server");
  const admin = createAdminClient();
  const { data: authUsers } = await admin.auth.admin.listUsers();
  const found = authUsers?.users.find(
    (u: { email?: string }) => u.email?.toLowerCase() === email
  ) as { id: string; email?: string } | undefined;
  if (!found) return;

  await supabase
    .from("group_students")
    .upsert({ group_id: groupId, user_id: found.id }, { onConflict: "group_id,user_id" });

  // Auto-inscribir en todos los cursos del grupo
  const { data: gc } = await supabase
    .from("group_courses")
    .select("course_id")
    .eq("group_id", groupId);

  if (gc && gc.length > 0) {
    await supabase.from("enrollments").upsert(
      gc.map((r) => ({ user_id: found.id, course_id: r.course_id, status: "activo" })),
      { onConflict: "user_id,course_id" }
    );
  }

  revalidatePath(`/admin/grupos/${groupId}`);
}

export async function removeStudentFromGroup(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const groupId = String(formData.get("group_id"));
  const userId = String(formData.get("user_id"));
  await supabase
    .from("group_students")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);
  revalidatePath(`/admin/grupos/${groupId}`);
}

export async function addCourseToGroup(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const groupId = String(formData.get("group_id"));
  const courseId = String(formData.get("course_id"));
  if (!courseId) return;

  await supabase
    .from("group_courses")
    .upsert({ group_id: groupId, course_id: courseId }, { onConflict: "group_id,course_id" });

  // Auto-inscribir todos los alumnos del grupo en este curso
  const { data: gs } = await supabase
    .from("group_students")
    .select("user_id")
    .eq("group_id", groupId);

  if (gs && gs.length > 0) {
    await supabase.from("enrollments").upsert(
      gs.map((r) => ({ user_id: r.user_id, course_id: courseId, status: "activo" })),
      { onConflict: "user_id,course_id" }
    );
  }

  revalidatePath(`/admin/grupos/${groupId}`);
}

export async function removeCourseFromGroup(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const groupId = String(formData.get("group_id"));
  const courseId = String(formData.get("course_id"));
  await supabase
    .from("group_courses")
    .delete()
    .eq("group_id", groupId)
    .eq("course_id", courseId);
  revalidatePath(`/admin/grupos/${groupId}`);
}

// ─── Actualizar curso (desde editor) ─────────────────────────

export async function updateCourse(formData: FormData) {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const priceMx = Number(formData.get("price") ?? 0);

  await supabase
    .from("courses")
    .update({
      title: String(formData.get("title")).trim(),
      subtitle: String(formData.get("subtitle") ?? ""),
      description: String(formData.get("description") ?? ""),
      cover_url: String(formData.get("cover_url") ?? "") || null,
      level: String(formData.get("level")),
      price_cents: Math.round(priceMx * 100),
      status: String(formData.get("status")),
    })
    .eq("id", id);

  revalidatePath(`/admin/cursos/${id}`);
  revalidatePath("/admin/cursos");
}
