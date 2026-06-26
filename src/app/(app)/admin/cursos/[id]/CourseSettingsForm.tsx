"use client";

import { useState, useTransition } from "react";
import { updateCourse } from "@/lib/server-actions";
import type { Category, Course } from "@/lib/types";

interface Props {
  course: Course;
  categories: Pick<Category, "id" | "name" | "color">[];
}

export function CourseSettingsForm({ course, categories }: Props) {
  const [categoryId, setCategoryId] = useState(course.category_id ?? "");
  const [level, setLevel] = useState(course.level);
  const [status, setStatus] = useState(course.status);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateCourse(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={course.id} />
      <input type="hidden" name="category_id" value={categoryId} />
      <input type="hidden" name="level" value={level} />
      <input type="hidden" name="status" value={status} />

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

      <div className="sm:col-span-2">
        <label htmlFor="c-category" className="mb-1 block text-sm font-medium">Categoría</label>
        <select
          id="c-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="select w-full"
        >
          <option value="">Sin categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="c-level" className="mb-1 block text-sm font-medium">Nivel</label>
        <select
          id="c-level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="select w-full"
        >
          <option value="principiante">Principiante</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>
      </div>

      <div>
        <label htmlFor="c-status" className="mb-1 block text-sm font-medium">Estado</label>
        <select
          id="c-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select w-full"
        >
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado</option>
          <option value="archivado">Archivado</option>
        </select>
      </div>

      <div>
        <label htmlFor="c-price" className="mb-1 block text-sm font-medium">Precio MXN (0 = gratis)</label>
        <input id="c-price" name="price" type="number" min="0" step="1" defaultValue={course.price_cents / 100} className="input w-full" />
      </div>

      <div className="flex items-end gap-3">
        <button type="submit" disabled={isPending} className="btn btn-primary flex-1">
          {isPending ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <i className="fa-solid fa-floppy-disk" />
          )}{" "}
          Guardar
        </button>
        {saved && (
          <span className="text-success text-sm flex items-center gap-1">
            <i className="fa-solid fa-check" /> Guardado
          </span>
        )}
      </div>
    </form>
  );
}
