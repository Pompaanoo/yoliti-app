"use client";

import { useState } from "react";
import type { DragDropData } from "@/lib/types";

export default function DragDropActivity({
  data,
  onComplete,
}: {
  data: DragDropData;
  onComplete: (pct: number) => void;
}) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  if (data.items.length === 0 || data.zones.length === 0) {
    return (
      <p className="text-sm text-base-content/50">
        Actividad no configurada todavía.
      </p>
    );
  }

  // Items que aún no se han colocado
  const unplaced = data.items.filter(
    (item) => !Object.keys(placements).includes(item)
  );

  const handleDragStart = (item: string) => setDragging(item);

  const handleDrop = (zone: string) => {
    if (!dragging) return;
    // Remover de zona anterior si estaba
    const prev = Object.fromEntries(
      Object.entries(placements).filter(([k]) => k !== dragging)
    );
    setPlacements({ ...prev, [dragging]: zone });
    setDragging(null);
    setChecked(false);
  };

  const handleRemove = (item: string) => {
    const updated = { ...placements };
    delete updated[item];
    setPlacements(updated);
    setChecked(false);
  };

  const handleCheck = () => {
    let correct = 0;
    for (const item of data.items) {
      if (placements[item] === data.mapping[item]) correct++;
    }
    const pct = Math.round((correct / data.items.length) * 100);
    setScore(pct);
    setChecked(true);
    onComplete(pct);
  };

  const handleReset = () => {
    setPlacements({});
    setChecked(false);
    setScore(0);
  };

  const itemsInZone = (zone: string) =>
    Object.entries(placements)
      .filter(([, z]) => z === zone)
      .map(([item]) => item);

  return (
    <div className="space-y-6">
      {data.instruction && (
        <div className="rounded-lg bg-info/10 px-4 py-3 text-sm text-info">
          <i className="fa-solid fa-circle-info mr-2" />
          {data.instruction}
        </div>
      )}

      {checked && (
        <div
          className={`rounded-box p-4 text-center ${
            score >= 70 ? "bg-success/10 text-success" : "bg-error/10 text-error"
          }`}
        >
          <p className="text-2xl font-extrabold">{score}%</p>
          <p className="mt-1 text-sm">
            {score >= 70 ? "¡Correcto!" : "Inténtalo de nuevo."}
          </p>
        </div>
      )}

      {/* Elementos disponibles */}
      {unplaced.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-base-content/40">
            Arrastra los elementos
          </p>
          <div className="flex flex-wrap gap-2 rounded-xl border border-dashed border-base-300 p-3">
            {unplaced.map((item) => (
              <div
                key={item}
                draggable
                onDragStart={() => handleDragStart(item)}
                className="cursor-grab rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary select-none active:cursor-grabbing"
              >
                <i className="fa-solid fa-grip-dots mr-1.5 text-xs" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zonas */}
      <div className="grid gap-3 sm:grid-cols-2">
        {data.zones.map((zone) => {
          const items = itemsInZone(zone);
          return (
            <div
              key={zone}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(zone)}
              className={`min-h-24 rounded-xl border-2 border-dashed p-3 transition-colors ${
                dragging
                  ? "border-primary/50 bg-primary/5"
                  : "border-base-300 bg-base-200"
              }`}
            >
              <p className="mb-2 text-xs font-bold uppercase text-secondary">
                {zone}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => {
                  const isCorrect = checked && data.mapping[item] === zone;
                  const isWrong = checked && data.mapping[item] !== zone;
                  return (
                    <span
                      key={item}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
                        isCorrect
                          ? "bg-success/15 text-success"
                          : isWrong
                          ? "bg-error/15 text-error"
                          : "bg-base-100 text-base-content"
                      }`}
                    >
                      {item}
                      {!checked && (
                        <button
                          onClick={() => handleRemove(item)}
                          className="ml-1 opacity-50 hover:opacity-100"
                        >
                          <i className="fa-solid fa-xmark text-xs" />
                        </button>
                      )}
                      {isCorrect && (
                        <i className="fa-solid fa-check text-xs" />
                      )}
                      {isWrong && (
                        <i className="fa-solid fa-xmark text-xs" />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={Object.keys(placements).length < data.items.length}
            className="btn btn-primary"
          >
            <i className="fa-solid fa-circle-check" /> Verificar
          </button>
        ) : (
          <button onClick={handleReset} className="btn btn-outline btn-primary">
            <i className="fa-solid fa-rotate" /> Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
