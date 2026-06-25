import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import {
  updateCourse,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  deleteLesson,
} from "@/lib/server-actions";
import type { Course, Module, Lesson } from "@/lib/types";

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
            className={`badge badge-sm mt-1 ${
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
        <form action={updateCourse} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={id} />
          <div className="sm:col-span-2">
            <label htmlFor="c-title" className="mb-1 block text-sm font-medium">Título *</label>
            <input id="c-title" name="title" defaultValue={course.title} required className="input w-full" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="c-subtitle" className="mb-1 block text-sm font-medium">Subtítulo</label>
            <input id="c-subtitle" name="subtitle" defaultValue={course.subtitle ?? ""} className="input w-full" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="c-desc" className="mb-1 block text-sm font-medium">Descripción</label>
            <textarea id="c-desc" name="description" defaultValue={course.description ?? ""} className="textarea h-24 w-full" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="c-cover" className="mb-1 block text-sm font-medium">URL imagen de portada</label>
            <input id="c-cover" name="cover_url" type="url" defaultValue={course.cover_url ?? ""} className="input w-full" placeholder="https://..." />
          </div>
          <div>
            <label htmlFor="c-level" className="mb-1 block text-sm font-medium">Nivel</label>
            <select id="c-level" name="level" defaultValue={course.level} className="select w-full">
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
          <div>
            <label htmlFor="c-status" className="mb-1 block text-sm font-medium">Estado</label>
            <select id="c-status" name="status" defaultValue={course.status} className="select w-full">
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicado</option>
              <option value="archivado">Archivado</option>
            </select>
          </div>
          <div>
            <label htmlFor="c-price" className="mb-1 block text-sm font-medium">Precio MXN (0 = gratis)</label>
            <input id="c-price" name="price" type="number" min="0" step="1" defaultValue={course.price_cents / 100} className="input w-full" />
          </div>
          <div className="flex items-end">
            <button className="btn btn-primary w-full">
              <i className="fa-solid fa-floppy-disk" /> Guardar
            </button>
          </div>
        </form>
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
