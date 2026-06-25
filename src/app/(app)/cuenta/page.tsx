import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import type { Profile } from "@/lib/types";
import {
  updateProfileAction,
  updateEmailAction,
  requestPasswordResetAction,
} from "./actions";
import { AvatarUploadForm } from "./_components/AvatarUploadForm";

export const metadata = { title: "Mi cuenta — Yoliti Academy" };

export default async function CuentaPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; error?: string }>;
}) {
  const { msg, error } = await searchParams;
  const user = await requireUser();

  const supabase = await createClient();
  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  const profile = profileRaw as Profile | null;

  const initial = (profile?.full_name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-secondary">Mi cuenta</h1>
        <p className="mt-1 text-sm text-base-content/60">
          Gestiona tu información personal y acceso.
        </p>
      </div>

      {/* Feedback */}
      {msg && (
        <div className="alert alert-success text-sm">
          <i className="fa-solid fa-circle-check" />
          {decodeURIComponent(msg)}
        </div>
      )}
      {error && (
        <div className="alert alert-error text-sm">
          <i className="fa-solid fa-circle-exclamation" />
          {decodeURIComponent(error)}
        </div>
      )}

      {/* Foto de perfil */}
      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4">
          <h2 className="font-bold text-secondary">Foto de perfil</h2>
          <p className="mt-0.5 text-xs text-base-content/50">
            Visible para otros usuarios de la plataforma.
          </p>
        </div>
        <div className="p-6">
          <AvatarUploadForm
            currentUrl={profile?.avatar_url ?? null}
            initial={initial}
          />
        </div>
      </section>

      {/* Información personal */}
      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4">
          <h2 className="font-bold text-secondary">Información personal</h2>
          <p className="mt-0.5 text-xs text-base-content/50">
            Actualiza tu nombre visible en la plataforma.
          </p>
        </div>
        <form action={updateProfileAction} className="space-y-4 p-6">
          <div>
            <label className="label label-text pb-1 text-xs font-medium">
              Nombre completo
            </label>
            <input
              name="full_name"
              type="text"
              className="input input-bordered w-full"
              defaultValue={profile?.full_name ?? ""}
              placeholder="Tu nombre completo"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm">
              Guardar cambios
            </button>
          </div>
        </form>
      </section>

      {/* Correo electrónico */}
      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4">
          <h2 className="font-bold text-secondary">Correo electrónico</h2>
          <p className="mt-0.5 text-xs text-base-content/50">
            Correo actual:{" "}
            <span className="font-medium text-base-content/70">{user.email}</span>
          </p>
        </div>
        <form action={updateEmailAction} className="space-y-4 p-6">
          <div>
            <label className="label label-text pb-1 text-xs font-medium">
              Nuevo correo electrónico
            </label>
            <input
              name="email"
              type="email"
              className="input input-bordered w-full"
              placeholder="nuevo@correo.com"
              required
            />
          </div>
          <p className="text-xs text-base-content/40">
            Se enviará un correo de confirmación a la nueva dirección. El cambio
            aplica cuando confirmes desde ese correo.
          </p>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-outline btn-sm">
              Cambiar correo
            </button>
          </div>
        </form>
      </section>

      {/* Contraseña */}
      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4">
          <h2 className="font-bold text-secondary">Contraseña</h2>
          <p className="mt-0.5 text-xs text-base-content/50">
            Te enviaremos un enlace seguro para establecer una nueva contraseña.
          </p>
        </div>
        <div className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium tracking-widest">••••••••••••</p>
            <p className="mt-0.5 text-xs text-base-content/40">
              El enlace llega al correo registrado
            </p>
          </div>
          <form action={requestPasswordResetAction}>
            <button type="submit" className="btn btn-outline btn-error btn-sm gap-2">
              <i className="fa-solid fa-key" />
              Solicitar cambio
            </button>
          </form>
        </div>
      </section>

      {/* Info de cuenta */}
      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-base-content/50">
          Información de la cuenta
        </h2>
        <div className="space-y-2 text-xs text-base-content/50">
          <div className="flex gap-3">
            <span className="w-24 font-medium">ID</span>
            <code className="text-secondary/70">{user.id}</code>
          </div>
          <div className="flex gap-3">
            <span className="w-24 font-medium">Rol</span>
            <span className="capitalize">{profile?.role?.replace("_", " ") ?? "—"}</span>
          </div>
          <div className="flex gap-3">
            <span className="w-24 font-medium">Miembro desde</span>
            <span>
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
