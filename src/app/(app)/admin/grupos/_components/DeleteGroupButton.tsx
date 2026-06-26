"use client";

import { deleteGroup } from "@/lib/server-actions";
import { useTransition } from "react";

export function DeleteGroupButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirm("¿Eliminar grupo? Esta acción no se puede deshacer.")) return;
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await deleteGroup(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={isPending}
        className="btn btn-error btn-sm btn-outline"
      >
        {isPending ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <i className="fa-solid fa-trash" />
        )}
      </button>
    </form>
  );
}
