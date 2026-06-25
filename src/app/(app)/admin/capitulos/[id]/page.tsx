import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import ChapterContentEditor from "@/components/admin/ChapterContentEditor";
import type { Lesson } from "@/lib/types";

export const metadata = { title: "Editor de capítulo — Yoliti Academy" };

export default async function CapituloEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();

  const { data: lessonRaw } = await supabase
    .from("lessons")
    .select("*, modules(course_id, title, courses(id, title))")
    .eq("id", id)
    .single();

  if (!lessonRaw) notFound();
  const lesson = lessonRaw as Lesson & {
    modules: { course_id: string; title: string; courses: { id: string; title: string } };
  };

  const courseId = lesson.modules?.course_id;
  const courseTitle = lesson.modules?.courses?.title ?? "Curso";
  const moduleTitle = lesson.modules?.title ?? "Módulo";

  return (
    <div className="mx-auto max-w-3xl">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-base-content/50">
        <Link href="/admin/cursos" className="hover:text-primary">Cursos</Link>
        <i className="fa-solid fa-chevron-right text-xs" />
        <Link href={`/admin/cursos/${courseId}`} className="hover:text-primary">
          {courseTitle}
        </Link>
        <i className="fa-solid fa-chevron-right text-xs" />
        <span>{moduleTitle}</span>
        <i className="fa-solid fa-chevron-right text-xs" />
        <span className="text-secondary font-medium">{lesson.title}</span>
      </div>

      <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <ChapterContentEditor
          chapterId={id}
          initialTitle={lesson.title}
          initialType={lesson.content_type ?? "video"}
          initialData={lesson.content_data ?? null}
        />
      </div>
    </div>
  );
}
