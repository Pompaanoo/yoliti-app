"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { updateCategory, deleteCategory } from "@/lib/server-actions";
import type { Category } from "@/lib/types";

const COLOR_VALUES = [
  { key: "indigo",  value: "#6366f1" },
  { key: "violet",  value: "#8b5cf6" },
  { key: "pink",    value: "#ec4899" },
  { key: "red",     value: "#ef4444" },
  { key: "orange",  value: "#f97316" },
  { key: "yellow",  value: "#eab308" },
  { key: "green",   value: "#22c55e" },
  { key: "cyan",    value: "#06b6d4" },
  { key: "blue",    value: "#3b82f6" },
  { key: "gray",    value: "#6b7280" },
] as const;

interface Props {
  cat: Category;
  courseCount: number;
}

export function CategoryRow({ cat, courseCount }: Props) {
  const t = useTranslations("adminCategorias");
  const tc = useTranslations("colors");
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
          placeholder={t("namePlaceholderES")}
          required
        />

        <input
          name="name_en"
          defaultValue={cat.name_en ?? ""}
          className="input input-bordered input-sm flex-1 min-w-32"
          placeholder={t("namePlaceholderEN")}
        />

        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="select select-bordered select-sm w-36"
        >
          {COLOR_VALUES.map((c) => (
            <option key={c.value} value={c.value}>
              {tc(c.key)}
            </option>
          ))}
        </select>

        <span className="badge badge-ghost badge-sm whitespace-nowrap">
          {t("coursesCount", { n: courseCount })}
        </span>

        {saved && (
          <span className="text-success text-xs flex items-center gap-1">
            <i className="fa-solid fa-check" /> {t("saved")}
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
        >
          <i className="fa-solid fa-trash text-[10px]" /> {t("delete")}
        </button>
      </form>
    </li>
  );
}
