"use client";

import { useState, useTransition } from "react";
import { saveQuizAttempt } from "@/lib/server-actions";
import type { QuizData } from "@/lib/types";

export default function QuizPlayer({
  data,
  lessonId,
  onComplete,
}: {
  data: QuizData;
  lessonId?: string;
  onComplete: (pct: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [, startTransition] = useTransition();

  if (data.questions.length === 0) {
    return (
      <p className="text-sm text-base-content/50">
        Este quiz no tiene preguntas todavía.
      </p>
    );
  }

  const handleSubmit = () => {
    let correct = 0;
    for (const q of data.questions) {
      if (answers[q.id] === q.correct) correct++;
    }
    const pct = Math.round((correct / data.questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    onComplete(pct);
    if (lessonId) {
      startTransition(async () => {
        await saveQuizAttempt(lessonId, pct, JSON.stringify(answers));
      });
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="space-y-6">
      {submitted && (
        <div
          className={`rounded-box p-4 text-center ${
            score >= 70
              ? "bg-success/10 text-success"
              : "bg-error/10 text-error"
          }`}
        >
          <p className="text-3xl font-extrabold">{score}%</p>
          <p className="mt-1 text-sm font-medium">
            {score >= 70
              ? "¡Excelente! Aprobaste el quiz."
              : "Necesitas repasar el material. Inténtalo de nuevo."}
          </p>
          <p className="mt-0.5 text-xs opacity-70">
            {data.questions.filter((q) => answers[q.id] === q.correct).length} de{" "}
            {data.questions.length} correctas
          </p>
        </div>
      )}

      {data.questions.map((q, qi) => {
        const chosen = answers[q.id];
        const isWrong = submitted && chosen !== undefined && chosen !== q.correct;

        return (
          <div key={q.id} className="rounded-xl border border-base-300 p-4">
            <p className="mb-3 text-sm font-semibold">
              <span className="mr-2 text-primary">{qi + 1}.</span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                let optClass =
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition";
                if (!submitted) {
                  optClass +=
                    chosen === oi
                      ? " border-primary bg-primary/10"
                      : " border-base-300 hover:border-primary/50";
                } else if (oi === q.correct) {
                  optClass += " border-success bg-success/10 text-success";
                } else if (oi === chosen && isWrong) {
                  optClass += " border-error bg-error/10 text-error";
                } else {
                  optClass += " border-base-300 opacity-50";
                }

                return (
                  <label key={oi} className={optClass}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      className="radio radio-primary radio-sm"
                      checked={chosen === oi}
                      disabled={submitted}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    />
                    {opt}
                    {submitted && oi === q.correct && (
                      <i className="fa-solid fa-circle-check ml-auto" />
                    )}
                    {submitted && oi === chosen && isWrong && (
                      <i className="fa-solid fa-circle-xmark ml-auto" />
                    )}
                  </label>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <div className="mt-3 rounded-lg bg-info/10 p-3 text-xs text-info">
                <i className="fa-solid fa-lightbulb mr-1" />
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < data.questions.length}
          className="btn btn-primary"
        >
          <i className="fa-solid fa-paper-plane" /> Enviar respuestas
        </button>
      ) : (
        <button onClick={handleReset} className="btn btn-outline btn-primary">
          <i className="fa-solid fa-rotate" /> Intentar de nuevo
        </button>
      )}
    </div>
  );
}
