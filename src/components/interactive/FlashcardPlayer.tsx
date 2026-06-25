"use client";

import { useState, useEffect } from "react";
import type { FlashcardsData } from "@/lib/types";

export default function FlashcardPlayer({
  data,
  onComplete,
}: {
  data: FlashcardsData;
  onComplete: (pct: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  useEffect(() => {
    setFlipped(false);
  }, [index]);

  if (data.cards.length === 0) {
    return (
      <p className="text-sm text-base-content/50">
        No hay tarjetas configuradas todavía.
      </p>
    );
  }

  const card = data.cards[index];
  const total = data.cards.length;

  const markSeen = () => {
    setSeen((prev) => new Set([...prev, index]));
  };

  const next = () => {
    markSeen();
    if (index < total - 1) {
      setIndex(index + 1);
    } else {
      setDone(true);
      onComplete(100);
    }
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-success/15 text-3xl text-success">
          <i className="fa-solid fa-trophy" />
        </span>
        <p className="text-xl font-bold text-secondary">
          ¡Completaste todas las tarjetas!
        </p>
        <button
          onClick={() => {
            setIndex(0);
            setSeen(new Set());
            setDone(false);
          }}
          className="btn btn-outline btn-primary btn-sm"
        >
          <i className="fa-solid fa-rotate" /> Repasar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progreso */}
      <div className="w-full">
        <div className="mb-1 flex justify-between text-xs text-base-content/50">
          <span>Tarjeta {index + 1} de {total}</span>
          <span>{seen.size} vistas</span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={index + 1}
          max={total}
        />
      </div>

      {/* Tarjeta con flip */}
      <div
        className="relative h-56 w-full max-w-lg cursor-pointer"
        style={{ perspective: 1000 }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="absolute inset-0 transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Frente */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary/60">
              Pregunta
            </p>
            <p className="text-xl font-bold text-secondary">{card.front}</p>
            <p className="mt-4 text-xs text-base-content/40">
              Toca para ver la respuesta
            </p>
          </div>

          {/* Reverso */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-accent/20 bg-accent/5 p-6 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent/60">
              Respuesta
            </p>
            <p className="text-xl font-bold text-secondary">{card.back}</p>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex gap-3">
        <button
          onClick={prev}
          disabled={index === 0}
          className="btn btn-ghost btn-sm"
        >
          <i className="fa-solid fa-arrow-left" /> Anterior
        </button>
        <button
          onClick={() => setFlipped((f) => !f)}
          className="btn btn-outline btn-primary btn-sm"
        >
          <i className="fa-solid fa-rotate" /> Voltear
        </button>
        <button onClick={next} className="btn btn-primary btn-sm">
          {index < total - 1 ? (
            <>Siguiente <i className="fa-solid fa-arrow-right" /></>
          ) : (
            <>Terminar <i className="fa-solid fa-circle-check" /></>
          )}
        </button>
      </div>
    </div>
  );
}
