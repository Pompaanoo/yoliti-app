"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser, requireRole } from "@/lib/auth";

// ─── Quiz attempts ────────────────────────────────────────────

export async function saveQuizAttempt(
  lessonId: string,
  scorePct: number,
  answersJson: string
) {
  const user = await requireUser();
  const supabase = await createClient();
  await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    lesson_id: lessonId,
    score_pct: scorePct,
    answers_json: JSON.parse(answersJson),
  });
}

// ─── Certificados ─────────────────────────────────────────────

export async function checkAndIssueCertificate(
  courseId: string
): Promise<string | null> {
  const user = await requireUser();
  const supabase = await createClient();

  // Obtener todas las lecciones del curso
  const { data: mods } = await supabase
    .from("modules")
    .select("lessons(id)")
    .eq("course_id", courseId);

  const allIds = (mods ?? []).flatMap(
    (m) => (m.lessons as { id: string }[]).map((l) => l.id)
  );
  if (allIds.length === 0) return null;

  // Verificar si completó todas
  const { data: done } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("completed", true)
    .in("lesson_id", allIds);

  if ((done?.length ?? 0) < allIds.length) return null;

  // Si ya tiene certificado, devolver el código existente
  const { data: existing } = await supabase
    .from("certificates")
    .select("code")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (existing) return existing.code;

  // Emitir certificado nuevo
  const { data: newCert } = await supabase
    .from("certificates")
    .insert({ user_id: user.id, course_id: courseId })
    .select("code")
    .single();

  return newCert?.code ?? null;
}

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
  const userId = String(formData.get("user_id"));
  if (!userId || !groupId) return;

  await supabase
    .from("group_students")
    .upsert({ group_id: groupId, user_id: userId }, { onConflict: "group_id,user_id" });

  // Auto-inscribir en todos los cursos del grupo
  const { data: gc } = await supabase
    .from("group_courses")
    .select("course_id")
    .eq("group_id", groupId);

  if (gc && gc.length > 0) {
    await supabase.from("enrollments").upsert(
      gc.map((r) => ({ user_id: userId, course_id: r.course_id, status: "activo" })),
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

  const categoryIds = formData.getAll("category_ids").map(String).filter(Boolean);

  const title = String(formData.get("title")).trim();
  const subtitle = String(formData.get("subtitle") ?? "");
  const description = String(formData.get("description") ?? "");

  let titleEn = String(formData.get("title_en") ?? "").trim() || null;
  let subtitleEn = String(formData.get("subtitle_en") ?? "").trim() || null;
  let descriptionEn = String(formData.get("description_en") ?? "").trim() || null;

  if (process.env.DEEPL_API_KEY) {
    const { translateToEnglish } = await import("@/lib/translate");
    const [t, s, d] = await Promise.all([
      titleEn ? titleEn : title ? translateToEnglish(title) : null,
      subtitleEn ? subtitleEn : subtitle ? translateToEnglish(subtitle) : null,
      descriptionEn ? descriptionEn : description ? translateToEnglish(description) : null,
    ]);
    titleEn = t;
    subtitleEn = s;
    descriptionEn = d;
  }

  // Subir portada a Supabase Storage si se adjuntó un archivo
  let coverUrl: string | null = null;
  const coverFile = formData.get("cover_file") as File | null;
  if (coverFile && coverFile.size > 0) {
    const ext = coverFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${id}/cover.${ext}`;
    const buffer = Buffer.from(await coverFile.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("courses")
      .upload(path, buffer, { contentType: coverFile.type, upsert: true });
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from("courses").getPublicUrl(path);
      coverUrl = `${publicUrl}?v=${Date.now()}`;
    }
  }

  const updatePayload: Record<string, unknown> = {
    title,
    subtitle,
    description,
    level: String(formData.get("level")),
    price_cents: Math.round(priceMx * 100),
    currency: String(formData.get("currency") || "usd").toLowerCase(),
    status: String(formData.get("status")),
    title_en: titleEn,
    subtitle_en: subtitleEn,
    description_en: descriptionEn,
  };
  if (coverUrl !== null) updatePayload.cover_url = coverUrl;

  await supabase
    .from("courses")
    .update(updatePayload)
    .eq("id", id);

  await supabase.from("course_categories").delete().eq("course_id", id);
  if (categoryIds.length > 0) {
    await supabase.from("course_categories").insert(
      categoryIds.map((catId) => ({ course_id: id, category_id: catId }))
    );
  }

  revalidatePath(`/admin/cursos/${id}`);
  revalidatePath("/admin/cursos");
  revalidatePath("/cursos");
}

// ─── Auto-traducir todos los cursos ──────────────────────────

export async function translateAllCourses(): Promise<number> {
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, subtitle, description, title_en, subtitle_en, description_en");

  if (!courses || courses.length === 0) return 0;

  const { translateAutoDetect } = await import("@/lib/translate");
  let translated = 0;

  for (const c of courses) {
    if (!c.title) continue;

    // Detectar idioma del título usando DeepL (traduciendo hacia inglés)
    const { text: titleToEn, sourceLang } = await translateAutoDetect(c.title, "en-US");
    const titleIsEnglish = sourceLang.startsWith("en");

    let titleEs = c.title;
    let titleEn = c.title_en ?? null;
    let subtitleEs = c.subtitle ?? null;
    let subtitleEn = c.subtitle_en ?? null;
    let descriptionEs = c.description ?? null;
    let descriptionEn = c.description_en ?? null;

    if (titleIsEnglish) {
      // title está en inglés: siempre traducir a español (aunque title_en ya exista)
      titleEn = c.title_en || c.title;
      const { text: es } = await translateAutoDetect(c.title, "es");
      titleEs = es;
      if (c.subtitle) {
        subtitleEn = c.subtitle_en || c.subtitle;
        const { text: es } = await translateAutoDetect(c.subtitle, "es");
        subtitleEs = es;
      }
      if (c.description) {
        descriptionEn = c.description_en || c.description;
        const { text: es } = await translateAutoDetect(c.description, "es");
        descriptionEs = es;
      }
    } else {
      // title está en español: traducir hacia inglés para _en
      if (!c.title_en) titleEn = titleToEn;
      if (c.subtitle && !c.subtitle_en) {
        const { text } = await translateAutoDetect(c.subtitle, "en-US");
        subtitleEn = text;
      }
      if (c.description && !c.description_en) {
        const { text } = await translateAutoDetect(c.description, "en-US");
        descriptionEn = text;
      }
    }

    await supabase
      .from("courses")
      .update({ title: titleEs, subtitle: subtitleEs, description: descriptionEs, title_en: titleEn, subtitle_en: subtitleEn, description_en: descriptionEn })
      .eq("id", c.id);

    translated++;
  }

  revalidatePath("/cursos");
  revalidatePath("/admin/cursos");
  return translated;
}

// ─── Categorías ───────────────────────────────────────────────

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCategory(formData: FormData) {
  await requireRole("super_admin");
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "#6366f1");
  if (!name) return;

  await supabase.from("categories").insert({
    name,
    slug: `${slugify(name)}-${Math.random().toString(36).slice(2, 5)}`,
    color,
  });
  revalidatePath("/admin/categorias");
}

export async function updateCategory(formData: FormData) {
  await requireRole("super_admin");
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "#6366f1");
  const name_en = String(formData.get("name_en") ?? "").trim() || null;
  if (!id || !name) return;

  await supabase.from("categories").update({ name, color, name_en }).eq("id", id);
  revalidatePath("/admin/categorias");
}

export async function deleteCategory(formData: FormData) {
  await requireRole("super_admin");
  const supabase = await createClient();
  const id = String(formData.get("id"));
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/cursos");
}
