import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireUser, getProfile } from "@/lib/auth";
import LessonPlayer from "@/components/LessonPlayer";
import type { Course, Lesson, Module } from "@/lib/types";

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export default async function AprenderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tc, tcommon, locale, user, supabase] = await Promise.all([
    getTranslations("course"),
    getTranslations("common"),
    getLocale(),
    requireUser(),
    createClient(),
  ]);

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!course) notFound();
  const c = course as Course;

  const profile = await getProfile();
  const isStaff =
    profile?.role === "super_admin" || c.teacher_id === user.id;

  // Verificar acceso: inscripción directa O pertenencia a grupo con este curso
  const { data: enr } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", c.id)
    .maybeSingle();

  let hasGroupAccess = false;
  if (!enr) {
    const { data: groupMembership } = await supabase
      .from("group_students")
      .select("group_id, groups!inner(group_courses!inner(course_id))")
      .eq("user_id", user.id);

    if (groupMembership && groupMembership.length > 0) {
      for (const gs of groupMembership as unknown as {
        group_id: string;
        groups: { group_courses: { course_id: string }[] };
      }[]) {
        if (gs.groups?.group_courses?.some((gc) => gc.course_id === c.id)) {
          hasGroupAccess = true;
          break;
        }
      }
    }
  }

  const hasAccess = !!enr || hasGroupAccess || isStaff;

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-md rounded-box border border-base-300 bg-base-100 p-8 text-center">
        <i className="fa-solid fa-lock mb-3 text-3xl text-accent" />
        <h1 className="text-xl font-bold text-secondary">
          {tc("noAccess")}
        </h1>
        <p className="mt-2 text-sm text-base-content/60">
          {tc("noAccessDesc")}
        </p>
        <Link href={`/cursos/${c.slug}`} className="btn btn-primary mt-4">
          {tcommon("viewCourse")}
        </Link>
      </div>
    );
  }

  const { data: modulesRaw } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", c.id)
    .order("position");

  const en = locale === "en";
  const courseTitle = (en && c.title_en) || c.title;
  const modules = ((modulesRaw as ModuleWithLessons[]) ?? []).map((m) => ({
    ...m,
    title: (en && m.title_en) || m.title,
    lessons: [...m.lessons]
      .sort((a, b) => a.position - b.position)
      .map((l) => ({
        ...l,
        title: (en && l.title_en) || l.title,
        content_data: (en && l.content_en) || l.content_data,
      })),
  }));

  const allLessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
  let completedIds = new Set<string>();

  if (allLessonIds.length > 0) {
    const { data: progressRaw } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("completed", true)
      .in("lesson_id", allLessonIds);

    completedIds = new Set(
      (progressRaw ?? []).map((r: { lesson_id: string }) => r.lesson_id)
    );
  }

  return (
    <LessonPlayer
      courseTitle={courseTitle}
      courseId={c.id}
      modules={modules}
      completedIds={completedIds}
    />
  );
}
