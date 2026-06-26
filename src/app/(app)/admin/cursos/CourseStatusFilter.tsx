"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { STATUS_BADGE } from "@/lib/course-status";

const STATUS_VALUES = ["", "publicado", "privado", "borrador", "archivado"] as const;

export function CourseStatusFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("status") ?? "";
  const t = useTranslations("adminCursos");
  const ts = useTranslations("status");

  function select(value: string) {
    router.replace(`/admin/cursos${value ? `?status=${value}` : "?"}`);
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {STATUS_VALUES.map((s) => {
        const isActive = current === s;
        const badgeClass = s ? STATUS_BADGE[s] : "";
        return (
          <button
            key={s}
            onClick={() => select(s)}
            className={`badge badge-md cursor-pointer border-2 transition-all ${
              isActive
                ? s
                  ? badgeClass
                  : "badge-secondary text-white border-secondary"
                : "badge-ghost border-base-300 hover:border-base-400"
            }`}
          >
            {s ? ts(s) : t("filterAll")}
          </button>
        );
      })}
    </div>
  );
}
