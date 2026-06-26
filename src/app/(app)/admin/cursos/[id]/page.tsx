import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import {
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  deleteLesson,
} from "@/lib/server-actions";
import type { Category, Course, Module, Lesson } from "@/lib/types";
import { CourseSettingsForm } from "./CourseSettingsForm";

export const metadata = { title: "Editor de curso — Yoliti Academy" };

const CONTENT_TYPE_ICONS: Record<string, string> = {
  video: "fa-circle-play",
  texto: "fa-file-lines",
  quiz: "fa-circle-question",
  dragdrop: "fa-hand-pointer",
  flashcards: "fa-cards-blank",
  pdf: "fa-file-pdf",
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  video: "Video",
  texto: "Texto",
  quiz: "Quiz",
  dragdrop: "Drag & Drop",
  flashcards: "Flashcards",
  pdf: "PDF",
};

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export default async function CourseEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();

  const { data: courseRaw } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (!courseRaw) notFound();
  const course = courseRaw as Course;

  const [{ data: categoriesRaw }, { data: assignedRaw }] = await Promise.all([
    supabase.from("categories").select("id, name, color").order("name"),
    supabase.from("course_categories").select("category_id").eq("course_id", id),
  ]);

  const categories = (categoriesRaw as Pick<Category, "id" | "name" | "color">[]) ?? [];
  const selectedCategoryIds = (assignedRaw ?? []).map((r: { category_id: string }) => r.category_id);

  const { data: modulesRaw } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", id)
    .order("position");

  const modules = ((modulesRaw as ModuleWithLessons[]) ?? []).map((m) => ({
    ...m,
    lessons: [...m.lessons].sort((a, b) => a.position - b.position),
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/cursos" className="btn btn-ghost btn-sm">
          <i className="fa-solid fa-arrow-left" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-secondary">{course.title}</h1>
          <span
            className={`badge badge-sm mt-1 capitalize text-white ${
              course.status === "publicado" ? "badge-success" : "badge-warning"
            }`}
          >
            {course.status}
          </span>
        </div>
      </div>

      {/* Datos del curso */}
      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-secondary">Configuración del curso</h2>
        <CourseSettingsForm
          key={`${course.id}-${[...selectedCategoryIds].sort().join(",")}-${course.level}-${course.status}`}
          course={course}
          categories={categories}
          selectedCategoryIds={selectedCategoryIds}
        />
      </section>

      {/* Módulos */}
      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-secondary">
            Módulos{" "}
            <span className="badge badge-primary ml-1">{modules.length}</span>
          </h2>
        </div>

        <div className="space-y-4">
          {modules.map((m, mi) => (
            <div
              key={m.id}
              className="rounded-xl border border-base-300 bg-base-200"
            >
              {/* Cabecera del módulo */}
              <div className="flex items-center gap-3 p-4">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-content text-xs font-bold">
                  {mi + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <form action={updateModule} className="flex gap-2">
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="course_id" value={id} />
                    <input
                      name="title"
                      defaultValue={m.title}
                      className="input input-sm flex-1 bg-base-100"
                    />
                    <button className="btn btn-sm btn-ghost">
                      <i className="fa-solid fa-floppy-disk text-primary" />
                    </button>
                  </form>
                </div>
                <form action={deleteModule}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="course_id" value={id} />
                  <button className="btn btn-ghost btn-sm text-error">
                    <i className="fa-solid fa-trash" />
                  </button>
                </form>
              </div>

              {/* Capítulos del módulo */}
              <div className="border-t border-base-300 px-4 pb-4 pt-3">
                {m.lessons.length === 0 ? (
                  <p className="mb-3 text-xs text-base-content/40">Sin capítulos.</p>
                ) : (
                  <ul className="mb-3 space-y-1.5">
                    {m.lessons.map((l, li) => (
                      <li
                        key={l.id}
                        className="flex items-center gap-3 rounded-lg bg-base-100 px-3 py-2"
                      >
                        <span className="text-xs text-base-content/40 w-4">{li + 1}</span>
                        <i
                          className={`fa-solid ${
                            CONTENT_TYPE_ICONS[l.content_type] ?? "fa-circle-play"
                          } w-4 text-primary text-xs`}
                        />
                        <span className="flex-1 truncate text-sm font-medium">
                          {l.title}
                        </span>
                        <span className="badge badge-ghost badge-xs">
                          {CONTENT_TYPE_LABELS[l.content_type] ?? l.content_type}
                        </span>
                        <Link
                          href={`/admin/capitulos/${l.id}`}
                          className="btn btn-ghost btn-xs text-primary"
                        >
                          <i className="fa-solid fa-pen" />
                        </Link>
                        <form action={deleteLesson}>
                          <input type="hidden" name="id" value={l.id} />
                          <input type="hidden" name="course_id" value={id} />
                          <button className="btn btn-ghost btn-xs text-error">
                            <i className="fa-solid fa-xmark" />
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Agregar capítulo */}
                <form action={createLesson} className="flex gap-2">
                  <input type="hidden" name="module_id" value={m.id} />
                  <input type="hidden" name="course_id" value={id} />
                  <input
                    name="title"
                    required
                    placeholder="Título del capítulo..."
                    className="input input-xs flex-1 bg-base-100"
                  />
                  <select name="content_type" className="select select-xs bg-base-100">
                    <option value="video">Video</option>
                    <option value="texto">Texto</option>
                    <option value="quiz">Quiz</option>
                    <option value="dragdrop">Drag & Drop</option>
                    <option value="flashcards">Flashcards</option>
                    <option value="pdf">PDF</option>
                  </select>
                  <button className="btn btn-primary btn-xs">
                    <i className="fa-solid fa-plus" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        {/* Agregar módulo */}
        <form action={createModule} className="mt-4 flex gap-2">
          <input type="hidden" name="course_id" value={id} />
          <input
            name="title"
            required
            placeholder="Nombre del nuevo módulo..."
            className="input input-sm flex-1"
          />
          <button className="btn btn-outline btn-primary btn-sm">
            <i className="fa-solid fa-plus" /> Agregar módulo
          </button>
        </form>
      </section>
    </div>
  );
}
