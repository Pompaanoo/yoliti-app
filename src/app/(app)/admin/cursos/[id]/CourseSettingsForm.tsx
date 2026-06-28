"use client";

import { useRef, useState, useTransition, type SyntheticEvent } from "react";
import { useTranslations } from "next-intl";
import { updateCourse } from "@/lib/server-actions";
import type { Category, Course, CourseLevel, CourseStatus } from "@/lib/types";

interface Props {
  course: Course;
  categories: Pick<Category, "id" | "name" | "color">[];
  selectedCategoryIds: string[];
}

export function CourseSettingsForm({ course, categories, selectedCategoryIds }: Props) {
  const t = useTranslations("editCurso");
  const tl = useTranslations("levels");
  const ts = useTranslations("status");

  const [selected, setSelected] = useState<string[]>(selectedCategoryIds);
  const [level, setLevel] = useState(course.level);
  const [status, setStatus] = useState(course.status);
  const [currency, setCurrency] = useState(course.currency ?? "usd");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const coverInputRef = useRef<HTMLInputElement>(null);

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
      setTimeout(() => setSaved(false), 5000);
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
        <label htmlFor="c-title" className="mb-1 block text-sm font-medium">{t("titleLabel")}</label>
        <input id="c-title" name="title" defaultValue={course.title} required className="input w-full" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-subtitle" className="mb-1 block text-sm font-medium">{t("subtitleLabel")}</label>
        <input id="c-subtitle" name="subtitle" defaultValue={course.subtitle ?? ""} className="input w-full" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-desc" className="mb-1 block text-sm font-medium">{t("descriptionLabel")}</label>
        <textarea id="c-desc" name="description" defaultValue={course.description ?? ""} className="textarea h-24 w-full" />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">{t("coverLabel")}</label>
        <div className="flex items-start gap-4">
          {(coverPreview ?? course.cover_url) && (
            <img
              src={coverPreview ?? course.cover_url ?? ""}
              alt="Portada"
              className="h-24 w-40 flex-shrink-0 rounded-lg object-cover border border-base-300"
            />
          )}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="btn btn-ghost btn-sm justify-start"
            >
              <i className="fa-solid fa-arrow-up-from-bracket text-xs" />
              {course.cover_url ? "Cambiar imagen" : "Subir imagen"}
            </button>
            <p className="text-xs text-base-content/40">JPG, PNG o WebP · Máx. 5 MB</p>
          </div>
        </div>
        <input
          ref={coverInputRef}
          name="cover_file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setCoverPreview(URL.createObjectURL(file));
          }}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium">{t("categoriesLabel")}</label>
        {categories.length === 0 ? (
          <p className="text-sm text-base-content/40">{t("noCategories")}</p>
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
        <label htmlFor="c-level" className="mb-1 block text-sm font-medium">{t("levelLabel")}</label>
        <select
          id="c-level"
          value={level}
          onChange={(e) => setLevel(e.target.value as CourseLevel)}
          className="select w-full"
        >
          <option value="principiante">{tl("principiante")}</option>
          <option value="intermedio">{tl("intermedio")}</option>
          <option value="avanzado">{tl("avanzado")}</option>
        </select>
      </div>

      <div>
        <label htmlFor="c-status" className="mb-1 block text-sm font-medium">{t("statusLabel")}</label>
        <select
          id="c-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as CourseStatus)}
          className="select w-full"
        >
          <option value="borrador">{ts("borrador")}</option>
          <option value="publicado">{ts("publicado")}</option>
          <option value="privado">{ts("privado")}</option>
          <option value="archivado">{ts("archivado")}</option>
        </select>
      </div>

      <div>
        <label htmlFor="c-price" className="mb-1 block text-sm font-medium">{t("priceLabel")}</label>
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

      <div className="sm:col-span-2 border-t border-base-300 pt-4">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-base-content/60">
          <i className="fa-solid fa-language" /> {t("translationsSection")}
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
          {t("save")}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-success">
            <i className="fa-solid fa-check" /> {t("saved")}
          </span>
        )}
      </div>
    </form>
  );
}
