"use client";

import { useRef, useState, useTransition } from "react";
import { updateAvatarAction } from "../actions";

export function AvatarUploadForm({
  currentUrl,
  initial,
}: {
  currentUrl: string | null;
  initial: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  function handleFormAction(formData: FormData) {
    startTransition(async () => {
      await updateAvatarAction(formData);
    });
  }

  const src = preview ?? currentUrl;

  return (
    <form action={handleFormAction} className="flex items-center gap-5">
      {/* Avatar clickable */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative flex-shrink-0 overflow-hidden rounded-full"
        title="Cambiar foto"
      >
        {src ? (
          <img
            src={src}
            alt="Avatar"
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <span className="grid h-20 w-20 place-items-center rounded-full bg-secondary text-secondary-content text-3xl font-bold">
            {initial}
          </span>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <i className="fa-solid fa-camera text-white text-base" />
          <span className="text-[10px] font-medium text-white">Cambiar</span>
        </div>
      </button>

      {/* Input oculto */}
      <input
        ref={inputRef}
        name="avatar"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleFile}
      />

      {/* Acciones */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn btn-ghost btn-sm justify-start"
        >
          <i className="fa-solid fa-arrow-up-from-bracket text-xs" />
          {currentUrl ? "Cambiar foto" : "Subir foto"}
        </button>

        {preview && (
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={isPending}
          >
            {isPending && (
              <span className="loading loading-spinner loading-xs" />
            )}
            Guardar foto
          </button>
        )}

        {currentUrl && !preview && (
          <p className="text-xs text-base-content/40">
            Haz clic en la imagen o en el botón para cambiarla
          </p>
        )}

        <p className="text-xs text-base-content/30">
          JPG, PNG o WebP · Máx. 5 MB
        </p>
      </div>
    </form>
  );
}
