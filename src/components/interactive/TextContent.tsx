"use client";

import { useEffect } from "react";
import type { TextData } from "@/lib/types";

export default function TextContent({
  data,
  onComplete,
}: {
  data: TextData;
  onComplete: (pct: number) => void;
}) {
  useEffect(() => {
    onComplete(100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data.body) {
    return (
      <p className="text-sm text-base-content/50">Sin contenido todavía.</p>
    );
  }

  return (
    <div
      className="article-body prose max-w-none text-base-content/80"
      dangerouslySetInnerHTML={{ __html: data.body }}
    />
  );
}
