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
      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        <Link href={`/admin/cursos/${courseId}`} className="btn btn-ghost btn-sm mt-1">
          <i className="fa-solid fa-arrow-left" />
        </Link>
        <div className="min-w-0">
          <p className="mb-1 flex flex-wrap items-center gap-1 text-xs text-base-content/40">
            <Link href="/admin/cursos" className="hover:text-primary">Cursos</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href={`/admin/cursos/${courseId}`} className="hover:text-primary truncate max-w-[160px]">
              {courseTitle}
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="truncate max-w-[120px]">{moduleTitle}</span>
          </p>
          <h1 className="text-2xl font-extrabold text-secondary">{lesson.title}</h1>
        </div>
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
