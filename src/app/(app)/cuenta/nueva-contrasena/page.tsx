"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function NuevaContrasenaPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (password.length < 8) {
      setErr("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setErr("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    router.push("/cuenta?msg=Contraseña+actualizada+correctamente");
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-secondary">Nueva contraseña</h1>
        <p className="mt-1 text-sm text-base-content/60">
          Elige una contraseña segura para tu cuenta.
        </p>
      </div>

      {err && (
        <div className="alert alert-error text-sm">
          <i className="fa-solid fa-circle-exclamation" />
          {err}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-box space-y-4 border border-base-300 bg-base-100 p-6 shadow-sm"
      >
        <div>
          <label className="label label-text pb-1 text-xs font-medium">
            Nueva contraseña
          </label>
          <input
            type="password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            minLength={8}
            required
          />
        </div>
        <div>
          <label className="label label-text pb-1 text-xs font-medium">
            Confirmar contraseña
          </label>
          <input
            type="password"
            className="input input-bordered w-full"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repite la contraseña"
            minLength={8}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading && <span className="loading loading-spinner loading-sm" />}
          Actualizar contraseña
        </button>
      </form>
    </div>
  );
}
