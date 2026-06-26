"use client";

import { useState } from "react";
import { translateAllCourses } from "@/lib/server-actions";

export function TranslateAllButton() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [count, setCount] = useState(0);

  async function handleClick() {
    setState("loading");
    try {
      const translated = await translateAllCourses();
      setCount(translated);
      setState("done");
      setTimeout(() => setState("idle"), 4000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className="btn btn-outline btn-sm gap-2"
    >
      {state === "loading" && <span className="loading loading-spinner loading-xs" />}
      {state === "idle" && <i className="fa-solid fa-language" />}
      {state === "done" && <i className="fa-solid fa-check text-success" />}
      {state === "error" && <i className="fa-solid fa-triangle-exclamation text-error" />}
      {state === "loading" && "Traduciendo…"}
      {state === "idle" && "Auto-traducir todos"}
      {state === "done" && `${count} curso${count !== 1 ? "s" : ""} traducido${count !== 1 ? "s" : ""}`}
      {state === "error" && "Error al traducir"}
    </button>
  );
}
