"use client";

import { useState, useTransition } from "react";
import { saveChapterContent } from "@/lib/server-actions";
import type {
  LessonType,
  VideoData,
  TextData,
  QuizData,
  QuizQuestion,
  DragDropData,
  FlashcardsData,
  PdfData,
  LessonContentData,
} from "@/lib/types";

const TYPE_OPTIONS: { value: LessonType; label: string; icon: string }[] = [
  { value: "video", label: "Video", icon: "fa-circle-play" },
  { value: "texto", label: "Texto / HTML", icon: "fa-file-lines" },
  { value: "quiz", label: "Quiz", icon: "fa-circle-question" },
  { value: "dragdrop", label: "Drag & Drop", icon: "fa-hand-pointer" },
  { value: "flashcards", label: "Flashcards", icon: "fa-cards-blank" },
  { value: "pdf", label: "PDF", icon: "fa-file-pdf" },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Sub-editors ──────────────────────────────────────────────

function VideoEditor({
  data,
  onChange,
}: {
  data: VideoData;
  onChange: (d: VideoData) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">URL del video *</label>
        <input
          type="url"
          value={data.url}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          className="input w-full"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Notas / descripción (opcional)</label>
        <textarea
          value={data.notes ?? ""}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          className="textarea h-28 w-full"
          placeholder="Notas adicionales para el alumno..."
        />
      </div>
    </div>
  );
}

function TextEditor({
  data,
  onChange,
}: {
  data: TextData;
  onChange: (d: TextData) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        Contenido HTML (o texto plano)
      </label>
      <textarea
        value={data.body}
        onChange={(e) => onChange({ body: e.target.value })}
        className="textarea h-64 w-full font-mono text-sm"
        placeholder="<h2>Título</h2><p>Contenido...</p>"
      />
    </div>
  );
}

function QuizEditor({
  data,
  onChange,
}: {
  data: QuizData;
  onChange: (d: QuizData) => void;
}) {
  const addQuestion = () => {
    onChange({
      questions: [
        ...data.questions,
        {
          id: uid(),
          question: "",
          type: "single",
          options: ["", ""],
          correct: 0,
          explanation: "",
        },
      ],
    });
  };

  const removeQuestion = (idx: number) => {
    onChange({ questions: data.questions.filter((_, i) => i !== idx) });
  };

  const updateQuestion = (idx: number, q: QuizQuestion) => {
    const updated = [...data.questions];
    updated[idx] = q;
    onChange({ questions: updated });
  };

  return (
    <div className="space-y-6">
      {data.questions.map((q, qi) => (
        <div key={q.id} className="rounded-xl border border-base-300 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-secondary">
              Pregunta {qi + 1}
            </span>
            <button
              type="button"
              onClick={() => removeQuestion(qi)}
              className="btn btn-ghost btn-xs text-error"
            >
              <i className="fa-solid fa-trash" />
            </button>
          </div>

          <div className="space-y-3">
            <input
              value={q.question}
              onChange={(e) => updateQuestion(qi, { ...q, question: e.target.value })}
              className="input input-sm w-full"
              placeholder="Enunciado de la pregunta..."
            />

            <div className="flex items-center gap-3">
              <label className="text-xs font-medium">Tipo:</label>
              <select
                value={q.type}
                onChange={(e) => {
                  const t = e.target.value as "single" | "truefalse";
                  updateQuestion(qi, {
                    ...q,
                    type: t,
                    options: t === "truefalse" ? ["Verdadero", "Falso"] : ["", ""],
                    correct: 0,
                  });
                }}
                className="select select-xs"
              >
                <option value="single">Opción múltiple</option>
                <option value="truefalse">Verdadero / Falso</option>
              </select>
            </div>

            {q.type === "single" && (
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correct === oi}
                      onChange={() => updateQuestion(qi, { ...q, correct: oi })}
                      className="radio radio-primary radio-sm"
                    />
                    <input
                      value={opt}
                      onChange={(e) => {
                        const opts = [...q.options];
                        opts[oi] = e.target.value;
                        updateQuestion(qi, { ...q, options: opts });
                      }}
                      className="input input-xs flex-1"
                      placeholder={`Opción ${oi + 1}`}
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          const opts = q.options.filter((_, i) => i !== oi);
                          updateQuestion(qi, {
                            ...q,
                            options: opts,
                            correct: Math.min(q.correct, opts.length - 1),
                          });
                        }}
                        className="btn btn-ghost btn-xs text-error"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    updateQuestion(qi, { ...q, options: [...q.options, ""] })
                  }
                  className="btn btn-ghost btn-xs"
                >
                  <i className="fa-solid fa-plus" /> Añadir opción
                </button>
              </div>
            )}

            {q.type === "truefalse" && (
              <div className="flex gap-4">
                {["Verdadero", "Falso"].map((opt, oi) => (
                  <label key={oi} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correct === oi}
                      onChange={() => updateQuestion(qi, { ...q, correct: oi })}
                      className="radio radio-primary radio-sm"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            <input
              value={q.explanation ?? ""}
              onChange={(e) => updateQuestion(qi, { ...q, explanation: e.target.value })}
              className="input input-xs w-full"
              placeholder="Explicación (se muestra después de responder, opcional)"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="btn btn-outline btn-primary btn-sm"
      >
        <i className="fa-solid fa-plus" /> Añadir pregunta
      </button>
    </div>
  );
}

function DragDropEditor({
  data,
  onChange,
}: {
  data: DragDropData;
  onChange: (d: DragDropData) => void;
}) {
  const addItem = () =>
    onChange({ ...data, items: [...data.items, ""] });

  const addZone = () =>
    onChange({ ...data, zones: [...data.zones, ""] });

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Instrucción</label>
        <input
          value={data.instruction}
          onChange={(e) => onChange({ ...data, instruction: e.target.value })}
          className="input w-full"
          placeholder="Arrastra cada elemento a su categoría..."
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Elementos (para arrastrar)</p>
        <div className="space-y-2">
          {data.items.map((item, ii) => (
            <div key={ii} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => {
                  const items = [...data.items];
                  const oldKey = items[ii];
                  items[ii] = e.target.value;
                  // Actualizar mapping si existía
                  const mapping = { ...data.mapping };
                  if (oldKey in mapping) {
                    mapping[e.target.value] = mapping[oldKey];
                    delete mapping[oldKey];
                  }
                  onChange({ ...data, items, mapping });
                }}
                className="input input-sm flex-1"
                placeholder={`Elemento ${ii + 1}`}
              />
              <select
                value={data.mapping[item] ?? ""}
                onChange={(e) => {
                  const mapping = { ...data.mapping };
                  if (e.target.value) {
                    mapping[item] = e.target.value;
                  } else {
                    delete mapping[item];
                  }
                  onChange({ ...data, mapping });
                }}
                className="select select-sm"
              >
                <option value="">→ Zona correcta</option>
                {data.zones.map((z, zi) => (
                  <option key={zi} value={z}>{z || `Zona ${zi + 1}`}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const items = data.items.filter((_, i) => i !== ii);
                  const mapping = { ...data.mapping };
                  delete mapping[item];
                  onChange({ ...data, items, mapping });
                }}
                className="btn btn-ghost btn-sm text-error"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addItem} className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-plus" /> Añadir elemento
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Zonas (destino)</p>
        <div className="space-y-2">
          {data.zones.map((zone, zi) => (
            <div key={zi} className="flex gap-2">
              <input
                value={zone}
                onChange={(e) => {
                  const zones = [...data.zones];
                  const oldZone = zones[zi];
                  zones[zi] = e.target.value;
                  const mapping = Object.fromEntries(
                    Object.entries(data.mapping).map(([k, v]) => [
                      k,
                      v === oldZone ? e.target.value : v,
                    ])
                  );
                  onChange({ ...data, zones, mapping });
                }}
                className="input input-sm flex-1"
                placeholder={`Zona ${zi + 1}`}
              />
              <button
                type="button"
                onClick={() => {
                  const zones = data.zones.filter((_, i) => i !== zi);
                  onChange({ ...data, zones });
                }}
                className="btn btn-ghost btn-sm text-error"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addZone} className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-plus" /> Añadir zona
          </button>
        </div>
      </div>
    </div>
  );
}

function FlashcardsEditor({
  data,
  onChange,
}: {
  data: FlashcardsData;
  onChange: (d: FlashcardsData) => void;
}) {
  const addCard = () =>
    onChange({ cards: [...data.cards, { front: "", back: "" }] });

  return (
    <div className="space-y-3">
      {data.cards.map((card, ci) => (
        <div key={ci} className="flex items-start gap-3 rounded-xl border border-base-300 p-3">
          <span className="mt-1 text-xs font-bold text-base-content/40 w-5">{ci + 1}</span>
          <div className="flex flex-1 gap-3">
            <div className="flex-1">
              <p className="mb-1 text-xs font-medium text-base-content/60">Frente</p>
              <textarea
                value={card.front}
                onChange={(e) => {
                  const cards = [...data.cards];
                  cards[ci] = { ...card, front: e.target.value };
                  onChange({ cards });
                }}
                className="textarea textarea-sm h-16 w-full"
                placeholder="Término / pregunta..."
              />
            </div>
            <div className="flex-1">
              <p className="mb-1 text-xs font-medium text-base-content/60">Reverso</p>
              <textarea
                value={card.back}
                onChange={(e) => {
                  const cards = [...data.cards];
                  cards[ci] = { ...card, back: e.target.value };
                  onChange({ cards });
                }}
                className="textarea textarea-sm h-16 w-full"
                placeholder="Definición / respuesta..."
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange({ cards: data.cards.filter((_, i) => i !== ci) })}
            className="btn btn-ghost btn-xs text-error mt-1"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      ))}
      <button type="button" onClick={addCard} className="btn btn-outline btn-primary btn-sm">
        <i className="fa-solid fa-plus" /> Añadir tarjeta
      </button>
    </div>
  );
}

function PdfEditor({
  data,
  onChange,
}: {
  data: PdfData;
  onChange: (d: PdfData) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">URL del PDF *</label>
      <input
        type="url"
        value={data.url}
        onChange={(e) => onChange({ url: e.target.value })}
        className="input w-full"
        placeholder="https://..."
      />
    </div>
  );
}

// ─── Default content data per type ───────────────────────────

function defaultData(type: LessonType): LessonContentData {
  switch (type) {
    case "video": return { url: "", notes: "" };
    case "texto": return { body: "" };
    case "quiz": return { questions: [] };
    case "dragdrop": return { instruction: "", items: [], zones: [], mapping: {} };
    case "flashcards": return { cards: [] };
    case "pdf": return { url: "" };
  }
}

// ─── Main editor ─────────────────────────────────────────────

export default function ChapterContentEditor({
  chapterId,
  initialTitle,
  initialType,
  initialData,
}: {
  chapterId: string;
  initialTitle: string;
  initialType: LessonType;
  initialData: LessonContentData | null;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [type, setType] = useState<LessonType>(initialType);
  const [contentData, setContentData] = useState<LessonContentData>(
    initialData ?? defaultData(initialType)
  );
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleTypeChange = (newType: LessonType) => {
    setType(newType);
    setContentData(defaultData(newType));
    setSaved(false);
  };

  const handleSave = () => {
    const fd = new FormData();
    fd.set("id", chapterId);
    fd.set("title", title);
    fd.set("content_type", type);
    fd.set("content_data_json", JSON.stringify(contentData));
    startTransition(async () => {
      await saveChapterContent(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 5000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <label className="mb-1 block text-sm font-medium">Título del capítulo *</label>
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setSaved(false); }}
          className="input w-full text-lg font-semibold"
        />
      </div>

      {/* Tipo de contenido */}
      <div>
        <p className="mb-2 text-sm font-medium">Tipo de contenido</p>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleTypeChange(t.value)}
              className={`btn btn-sm gap-2 ${
                type === t.value ? "btn-primary" : "btn-ghost border border-base-300"
              }`}
            >
              <i className={`fa-solid ${t.icon}`} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor específico */}
      <div className="rounded-box border border-base-300 bg-base-100 p-5">
        {type === "video" && (
          <VideoEditor
            data={contentData as VideoData}
            onChange={(d) => { setContentData(d); setSaved(false); }}
          />
        )}
        {type === "texto" && (
          <TextEditor
            data={contentData as TextData}
            onChange={(d) => { setContentData(d); setSaved(false); }}
          />
        )}
        {type === "quiz" && (
          <QuizEditor
            data={contentData as QuizData}
            onChange={(d) => { setContentData(d); setSaved(false); }}
          />
        )}
        {type === "dragdrop" && (
          <DragDropEditor
            data={contentData as DragDropData}
            onChange={(d) => { setContentData(d); setSaved(false); }}
          />
        )}
        {type === "flashcards" && (
          <FlashcardsEditor
            data={contentData as FlashcardsData}
            onChange={(d) => { setContentData(d); setSaved(false); }}
          />
        )}
        {type === "pdf" && (
          <PdfEditor
            data={contentData as PdfData}
            onChange={(d) => { setContentData(d); setSaved(false); }}
          />
        )}
      </div>

      {/* Guardar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="btn btn-primary"
        >
          {isPending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <i className="fa-solid fa-floppy-disk" />
          )}
          {isPending ? "Guardando…" : "Guardar capítulo"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-success">
            <i className="fa-solid fa-circle-check" /> Guardado
          </span>
        )}
      </div>
    </div>
  );
}
