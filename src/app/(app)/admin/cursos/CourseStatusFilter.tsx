"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { STATUS_BADGE } from "@/lib/course-status";

const STATUSES = [
  { value: "", label: "Todos" },
  { value: "publicado", label: "Publicado" },
  { value: "privado", label: "Privado" },
  { value: "borrador", label: "Borrador" },
  { value: "archivado", label: "Archivado" },
];

export function CourseStatusFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("status") ?? "";

  function select(value: string) {
    const url = value ? `?status=${value}` : "?";
    router.replace(`/admin/cursos${url}`);
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {STATUSES.map((s) => {
        const isActive = current === s.value;
        const badgeClass = s.value ? STATUS_BADGE[s.value] : "";
        return (
          <button
            key={s.value}
            onClick={() => select(s.value)}
            className={`badge badge-md cursor-pointer border-2 transition-all ${
              isActive
                ? s.value
                  ? badgeClass
                  : "badge-secondary text-white border-secondary"
                : "badge-ghost border-base-300 hover:border-base-400"
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
