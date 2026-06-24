"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lesson, Module } from "@/lib/types";

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export default function LessonPlayer({
  courseTitle,
  courseSlug,
  modules,
}: {
  courseTitle: string;
  courseSlug: string;
  modules: ModuleWithLessons[];
}) {
  const allLessons = modules.flatMap((m) =>
    [...m.lessons].sort((a, b) => a.position - b.position)
  );
  const [activeId, setActiveId] = useState(allLessons[0]?.id ?? null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const active = allLessons.find((l) => l.id === activeId) ?? null;

  return (
    <div className="flex h-[calc(100vh-2rem)] overflow-hidden rounded-box border border-base-300 bg-base-100">
      {/* Sidebar de contenido */}
      <aside
        className={`flex flex-col border-r border-base-300 bg-base-200 transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-0"
        } overflow-hidden`}
      >
        <div className="border-b border-base-300 p-4">
          <Link
            href="/dashboard"
            className="text-xs text-base-content/50 hover:text-primary"
          >
            <i className="fa-solid fa-arrow-left" /> Mis cursos
          </Link>
          <h2 className="mt-1 truncate font-bold text-secondary">
            {courseTitle}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {modules.map((m, i) => (
            <div key={m.id} className="mb-4">
              <p className="px-2 text-xs font-semibold uppercase text-base-content/40">
                Módulo {i + 1}: {m.title}
              </p>
              <ul className="mt-1 space-y-1">
                {m.lessons.length === 0 ? (
                  <li className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-base-content/40">
                    <i className="fa-solid fa-lock text-xs" />
                    <span>Contenido para miembros</span>
                  </li>
                ) : (
                  [...m.lessons]
                    .sort((a, b) => a.position - b.position)
                    .map((l) => (
                      <li key={l.id}>
                        <button
                          onClick={() => setActiveId(l.id)}
                          className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition ${
                            l.id === activeId
                              ? "bg-primary text-primary-content"
                              : "hover:bg-base-300"
                          }`}
                        >
                          <i className="fa-solid fa-circle-play text-xs" />
                          <span className="flex-1 truncate">{l.title}</span>
                          {l.duration_minutes && (
                            <span className="text-xs opacity-60">
                              {l.duration_minutes}m
                            </span>
                          )}
                        </button>
                      </li>
                    ))
                )}
              </ul>
            </div>
          ))}
          {modules.length === 0 && (
            <p className="p-4 text-sm text-base-content/50">
              Este curso aún no tiene lecciones.
            </p>
          )}
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-base-300 px-4 py-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="btn btn-ghost btn-sm btn-square"
            title="Mostrar/ocultar contenido del curso"
          >
            <i className="fa-solid fa-table-columns" />
          </button>
          <h1 className="truncate font-semibold">
            {active?.title ?? "Selecciona una lección"}
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="flex aspect-video w-full items-center justify-center bg-neutral text-neutral-content">
            {active?.video_url ? (
              <video src={active.video_url} controls className="h-full w-full" />
            ) : (
              <div className="text-center text-neutral-content/60">
                <i className="fa-solid fa-film mb-2 text-4xl" />
                <p className="text-sm">
                  {active
                    ? "Video pendiente — agrega la URL desde el panel de maestro."
                    : "Selecciona una lección para empezar."}
                </p>
              </div>
            )}
          </div>
          {active?.content && (
            <div className="prose max-w-none p-6 text-base-content/80">
              <h2 className="text-secondary">{active.title}</h2>
              <p>{active.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
