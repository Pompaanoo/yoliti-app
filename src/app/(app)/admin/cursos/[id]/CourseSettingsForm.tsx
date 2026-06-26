"use client";

import { useState, useTransition, type SyntheticEvent } from "react";
import { updateCourse } from "@/lib/server-actions";
import type { Category, Course, CourseLevel, CourseStatus } from "@/lib/types";

interface Props {
  course: Course;
  categories: Pick<Category, "id" | "name" | "color">[];
  selectedCategoryIds: string[];
}

export function CourseSettingsForm({ course, categories, selectedCategoryIds }: Props) {
  const [selected, setSelected] = useState<string[]>(selectedCategoryIds);
  const [level, setLevel] = useState(course.level);
  const [status, setStatus] = useState(course.status);
  const [currency, setCurrency] = useState(course.currency ?? "usd");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
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
      <input type="hidden" name="level" value={level} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="currency" value={currency} />
      {selected.map((catId) => (
        <input key={catId} type="hidden" name="category_ids" value={catId} />
      ))}

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
        <label className="mb-2 block text-sm font-medium">Categorías</label>
        {categories.length === 0 ? (
          <p className="text-sm text-base-content/40">No hay categorías disponibles.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = selected.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggle(cat.id)}
                  className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-sm font-medium transition-all ${
                    isSelected
                      ? "border-transparent text-white"
                      : "border-base-300 bg-base-100 text-base-content/70 hover:border-base-400"
                  }`}
                  style={isSelected ? { backgroundColor: cat.color, borderColor: cat.color } : undefined}
                >
                  <span
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: isSelected ? "rgba(255,255,255,0.6)" : cat.color }}
                  />
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="c-level" className="mb-1 block text-sm font-medium">Nivel</label>
        <select
          id="c-level"
          value={level}
          onChange={(e) => setLevel(e.target.value as CourseLevel)}
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
          onChange={(e) => setStatus(e.target.value as CourseStatus)}
          className="select w-full"
        >
          <option value="borrador">Borrador</option>
          <option value="publicado">Publicado</option>
          <option value="archivado">Archivado</option>
        </select>
      </div>

      <div>
        <label htmlFor="c-price" className="mb-1 block text-sm font-medium">Precio (0 = gratis)</label>
        <div className="flex gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="select w-28 shrink-0"
          >
            <option value="usd">USD</option>
            <option value="mxn">MXN</option>
          </select>
          <input id="c-price" name="price" type="number" min="0" step="1" defaultValue={course.price_cents / 100} className="input flex-1" />
        </div>
      </div>

      {/* English translations */}
      <div className="sm:col-span-2 border-t border-base-300 pt-4">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-base-content/60">
          <i className="fa-solid fa-language" /> Traducción en inglés (opcional)
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="c-title-en" className="mb-1 block text-sm font-medium">Title (EN)</label>
            <input id="c-title-en" name="title_en" defaultValue={course.title_en ?? ""} className="input w-full" placeholder="English title…" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="c-subtitle-en" className="mb-1 block text-sm font-medium">Subtitle (EN)</label>
            <input id="c-subtitle-en" name="subtitle_en" defaultValue={course.subtitle_en ?? ""} className="input w-full" placeholder="English subtitle…" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="c-desc-en" className="mb-1 block text-sm font-medium">Description (EN)</label>
            <textarea id="c-desc-en" name="description_en" defaultValue={course.description_en ?? ""} className="textarea h-24 w-full" placeholder="English description…" />
          </div>
        </div>
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
          <span className="flex items-center gap-1 text-sm text-success">
            <i className="fa-solid fa-check" /> Guardado
          </span>
        )}
      </div>
    </form>
  );
}
