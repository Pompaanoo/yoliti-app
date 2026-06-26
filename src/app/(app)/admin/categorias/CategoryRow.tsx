"use client";

import { useState, useTransition } from "react";
import { updateCategory, deleteCategory } from "@/lib/server-actions";
import type { Category } from "@/lib/types";

const PRESET_COLORS = [
  { label: "Índigo",   value: "#6366f1" },
  { label: "Violeta",  value: "#8b5cf6" },
  { label: "Rosa",     value: "#ec4899" },
  { label: "Rojo",     value: "#ef4444" },
  { label: "Naranja",  value: "#f97316" },
  { label: "Amarillo", value: "#eab308" },
  { label: "Verde",    value: "#22c55e" },
  { label: "Cian",     value: "#06b6d4" },
  { label: "Azul",     value: "#3b82f6" },
  { label: "Gris",     value: "#6b7280" },
];

interface Props {
  cat: Category;
  courseCount: number;
}

export function CategoryRow({ cat, courseCount }: Props) {
  const [color, setColor] = useState(cat.color);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateCategory(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 5000);
    });
  }

  return (
    <li className="px-6 py-4">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="id" value={cat.id} />
        <input type="hidden" name="color" value={color} />

        <span
          className="h-4 w-4 flex-shrink-0 rounded-full transition-colors"
          style={{ backgroundColor: color }}
        />

        <input
          name="name"
          defaultValue={cat.name}
          className="input input-bordered input-sm flex-1 min-w-32"
          placeholder="Nombre (ES)"
          required
        />

        <input
          name="name_en"
          defaultValue={cat.name_en ?? ""}
          className="input input-bordered input-sm flex-1 min-w-32"
          placeholder="Name (EN)"
        />

        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="select select-bordered select-sm w-36"
        >
          {PRESET_COLORS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <span className="badge badge-ghost badge-sm whitespace-nowrap">
          {courseCount} curso{courseCount !== 1 ? "s" : ""}
        </span>

        {saved && (
          <span className="text-success text-xs flex items-center gap-1">
            <i className="fa-solid fa-check" /> Guardado
          </span>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="btn btn-ghost btn-sm text-primary"
        >
          {isPending ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <i className="fa-solid fa-floppy-disk" />
          )}
        </button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          startTransition(() => deleteCategory(formData));
        }}
        className="mt-1 ml-7"
      >
        <input type="hidden" name="id" value={cat.id} />
        <button
          type="submit"
          className="btn btn-ghost btn-xs text-error"
          title="Eliminar (los cursos quedarán sin categoría)"
        >
          <i className="fa-solid fa-trash text-[10px]" /> Eliminar
        </button>
      </form>
    </li>
  );
}
