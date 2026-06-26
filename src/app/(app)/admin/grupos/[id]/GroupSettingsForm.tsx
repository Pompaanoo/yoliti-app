"use client";

import { useState, useTransition } from "react";
import { updateGroup } from "@/lib/server-actions";
import type { Group } from "@/lib/types";

export function GroupSettingsForm({ group }: { group: Group }) {
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateGroup(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 5000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={group.id} />
      <div className="sm:col-span-2">
        <label htmlFor="name" className="mb-1 block text-sm font-medium">Nombre</label>
        <input
          id="name"
          name="name"
          defaultValue={group.name}
          required
          className="input w-full"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="description" className="mb-1 block text-sm font-medium">Descripción</label>
        <textarea
          id="description"
          name="description"
          defaultValue={group.description ?? ""}
          className="textarea h-24 w-full"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="image_url" className="mb-1 block text-sm font-medium">URL de imagen</label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={group.image_url ?? ""}
          className="input w-full"
          placeholder="https://..."
        />
      </div>
      {group.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={group.image_url}
          alt=""
          className="sm:col-span-2 h-40 w-full rounded-box object-cover"
        />
      )}
      <div className="sm:col-span-2 flex items-center gap-3">
        <button type="submit" disabled={isPending} className="btn btn-primary">
          {isPending ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <i className="fa-solid fa-floppy-disk" />
          )}{" "}
          Guardar cambios
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-success">
            <i className="fa-solid fa-check" /> Guardado
          </span>
        )}
      </div>
    </form>
  );
}
