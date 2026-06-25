"use client";

import { useEffect } from "react";
import type { PdfData } from "@/lib/types";

export default function PdfViewer({
  data,
  onComplete,
}: {
  data: PdfData;
  onComplete: (pct: number) => void;
}) {
  useEffect(() => {
    onComplete(100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data.url) {
    return (
      <p className="text-sm text-base-content/50">
        PDF no configurado todavía.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg bg-base-200 px-4 py-2">
        <span className="text-sm font-medium text-secondary">
          <i className="fa-solid fa-file-pdf mr-2 text-error" />
          Documento PDF
        </span>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-xs"
        >
          <i className="fa-solid fa-arrow-up-right-from-square" /> Abrir
        </a>
      </div>
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(data.url)}&embedded=true`}
        className="h-[600px] w-full rounded-box border border-base-300"
        title="PDF"
      />
    </div>
  );
}
