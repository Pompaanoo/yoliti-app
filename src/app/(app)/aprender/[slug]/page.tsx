import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
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
  const user = await requireUser();
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!course) notFound();
  const c = course as Course;

  // Verificar inscripción (los cursos gratis se consideran accesibles).
  const { data: enr } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", c.id)
    .maybeSingle();

  if (!enr && c.price_cents > 0) {
    return (
      <div className="mx-auto max-w-md rounded-box border border-base-300 bg-base-100 p-8 text-center">
        <i className="fa-solid fa-lock mb-3 text-3xl text-accent" />
        <h1 className="text-xl font-bold text-secondary">
          No tienes acceso a este curso
        </h1>
        <p className="mt-2 text-sm text-base-content/60">
          Inscríbete para empezar a aprender.
        </p>
        <Link href={`/cursos/${c.slug}`} className="btn btn-primary mt-4">
          Ver curso
        </Link>
      </div>
    );
  }

  const { data: modulesData } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", c.id)
    .order("position");

  const modules = (modulesData as ModuleWithLessons[]) ?? [];

  return (
    <LessonPlayer
      courseTitle={c.title}
      courseSlug={c.slug}
      modules={modules}
    />
  );
}
