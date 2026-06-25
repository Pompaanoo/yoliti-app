"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { markLessonProgress } from "@/lib/server-actions";
import ChapterViewer from "./ChapterViewer";
import type { Lesson, Module } from "@/lib/types";

const TYPE_ICONS: Record<string, string> = {
  video: "fa-circle-play",
  texto: "fa-file-lines",
  quiz: "fa-circle-question",
  dragdrop: "fa-hand-pointer",
  flashcards: "fa-cards-blank",
  pdf: "fa-file-pdf",
};

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export default function LessonPlayer({
  courseTitle,
  modules,
  completedIds,
}: {
  courseTitle: string;
  modules: ModuleWithLessons[];
  completedIds: Set<string>;
}) {
  const allLessons = modules.flatMap((m) =>
    [...m.lessons].sort((a, b) => a.position - b.position)
  );

  const [activeId, setActiveId] = useState(allLessons[0]?.id ?? null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(
    new Set(completedIds)
  );
  const [, startTransition] = useTransition();

  const active = allLessons.find((l) => l.id === activeId) ?? null;

  const handleComplete = (lessonId: string, pct: number) => {
    if (pct >= 100) {
      setLocalCompleted((prev) => new Set([...prev, lessonId]));
    }
    startTransition(async () => {
      await markLessonProgress(lessonId, pct);
    });
  };

  const goNext = () => {
    const idx = allLessons.findIndex((l) => l.id === activeId);
    if (idx >= 0 && idx < allLessons.length - 1) {
      setActiveId(allLessons[idx + 1].id);
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] overflow-hidden rounded-box border border-base-300 bg-base-100">
      {/* Sidebar */}
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
          <h2 className="mt-1 truncate font-bold text-secondary">{courseTitle}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {modules.map((m, mi) => {
            const mLessons = [...m.lessons].sort((a, b) => a.position - b.position);
            const doneInModule = mLessons.filter((l) => localCompleted.has(l.id)).length;
            return (
              <div key={m.id} className="mb-4">
                <div className="mb-1 flex items-center justify-between px-2">
                  <p className="text-xs font-semibold uppercase text-base-content/40">
                    M{mi + 1}: {m.title}
                  </p>
                  {mLessons.length > 0 && (
                    <span className="text-xs text-base-content/30">
                      {doneInModule}/{mLessons.length}
                    </span>
                  )}
                </div>
                <ul className="space-y-1">
                  {mLessons.length === 0 ? (
                    <li className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-base-content/40">
                      <i className="fa-solid fa-lock text-xs" />
                      <span>Contenido para miembros</span>
                    </li>
                  ) : (
                    mLessons.map((l) => {
                      const isDone = localCompleted.has(l.id);
                      return (
                        <li key={l.id}>
                          <button
                            onClick={() => setActiveId(l.id)}
                            className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition ${
                              l.id === activeId
                                ? "bg-primary text-primary-content"
                                : "hover:bg-base-300"
                            }`}
                          >
                            <i
                              className={`fa-solid ${
                                isDone
                                  ? "fa-circle-check text-success"
                                  : (TYPE_ICONS[l.content_type] ?? "fa-circle-play")
                              } text-xs w-4`}
                            />
                            <span className="flex-1 truncate">{l.title}</span>
                            {l.duration_minutes && (
                              <span className="text-xs opacity-60">
                                {l.duration_minutes}m
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            );
          })}
          {modules.length === 0 && (
            <p className="p-4 text-sm text-base-content/50">
              Este curso aún no tiene lecciones.
            </p>
          )}
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-3 border-b border-base-300 px-4 py-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="btn btn-ghost btn-sm btn-square"
          >
            <i className="fa-solid fa-table-columns" />
          </button>
          <h1 className="flex-1 truncate font-semibold">
            {active?.title ?? "Selecciona un capítulo"}
          </h1>
          {active && localCompleted.has(active.id) && (
            <span className="flex items-center gap-1 text-xs text-success">
              <i className="fa-solid fa-circle-check" /> Completado
            </span>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {active ? (
            <div className="mx-auto max-w-3xl">
              <ChapterViewer lesson={active} onComplete={handleComplete} />

              {/* Botón siguiente capítulo */}
              {allLessons.findIndex((l) => l.id === activeId) <
                allLessons.length - 1 && (
                <div className="mt-6 flex justify-end">
                  <button onClick={goNext} className="btn btn-primary btn-sm">
                    Siguiente capítulo{" "}
                    <i className="fa-solid fa-arrow-right" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-base-content/30">
              <div className="text-center">
                <i className="fa-solid fa-book-open mb-3 text-4xl" />
                <p>Selecciona un capítulo para empezar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
