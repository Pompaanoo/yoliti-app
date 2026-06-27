"use client";

import { useState, useTransition } from "react";
import type { UserRole } from "@/lib/types";

interface Props {
  userId: string;
  currentRole: UserRole;
  changeRole: (formData: FormData) => Promise<void>;
}

export function RoleForm({ userId, currentRole, changeRole }: Props) {
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await changeRole(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 5000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        className="select select-bordered select-xs"
      >
        <option value="alumno">Alumno</option>
        <option value="maestro">Maestro</option>
        <option value="super_admin">Super admin</option>
      </select>
      <button disabled={isPending} className="btn btn-primary btn-xs">
        {isPending ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          "Guardar"
        )}
      </button>
      {saved && (
        <span className="flex items-center gap-1 text-xs text-success">
          <i className="fa-solid fa-check" /> Guardado
        </span>
      )}
    </form>
  );
}
