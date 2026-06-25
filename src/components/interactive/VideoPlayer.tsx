"use client";

import type { VideoData } from "@/lib/types";

export default function VideoPlayer({
  data,
  onComplete,
}: {
  data: VideoData;
  onComplete: (pct: number) => void;
}) {
  return (
    <div className="space-y-4">
      {data.url ? (
        <div className="aspect-video w-full overflow-hidden rounded-box bg-black">
          {data.url.includes("youtube.com") || data.url.includes("youtu.be") ? (
            <iframe
              src={data.url
                .replace("watch?v=", "embed/")
                .replace("youtu.be/", "www.youtube.com/embed/")}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video"
            />
          ) : (
            <video
              src={data.url}
              controls
              className="h-full w-full"
              onEnded={() => onComplete(100)}
            />
          )}
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-box bg-neutral text-neutral-content/40">
          <div className="text-center">
            <i className="fa-solid fa-film mb-2 text-4xl" />
            <p className="text-sm">Video no configurado</p>
          </div>
        </div>
      )}

      {data.notes && (
        <div className="rounded-box border border-base-300 bg-base-200 p-4">
          <p className="mb-1 text-xs font-semibold uppercase text-base-content/40">
            Notas del instructor
          </p>
          <p className="text-sm leading-relaxed text-base-content/80">{data.notes}</p>
        </div>
      )}

      <button
        onClick={() => onComplete(100)}
        className="btn btn-success btn-sm"
      >
        <i className="fa-solid fa-circle-check" /> Marcar como completado
      </button>
    </div>
  );
}
