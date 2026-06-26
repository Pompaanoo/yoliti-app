import { getTranslations, getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import type { Profile } from "@/lib/types";
import { updateProfileAction, updateEmailAction, requestPasswordResetAction } from "./actions";
import { AvatarUploadForm } from "./_components/AvatarUploadForm";
import { AutoDismissAlert } from "./_components/AutoDismissAlert";

export const metadata = { title: "Mi cuenta — Yoliti Academy" };

export default async function CuentaPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; error?: string }>;
}) {
  const { msg, error } = await searchParams;
  const [user, t, locale] = await Promise.all([
    requireUser(),
    getTranslations("cuenta"),
    getLocale(),
  ]);

  const supabase = await createClient();
  const { data: profileRaw } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const profile = profileRaw as Profile | null;
  const initial = (profile?.full_name || user.email || "U").charAt(0).toUpperCase();
  const dateLocale = locale === "en" ? "en-US" : "es-MX";

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-secondary">{t("title")}</h1>
        <p className="mt-1 text-sm text-base-content/60">{t("subtitle")}</p>
      </div>

      {msg && <AutoDismissAlert type="success" message={decodeURIComponent(msg)} />}
      {error && <AutoDismissAlert type="error" message={decodeURIComponent(error)} />}

      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4">
          <h2 className="font-bold text-secondary">{t("photoTitle")}</h2>
          <p className="mt-0.5 text-xs text-base-content/50">{t("photoSub")}</p>
        </div>
        <div className="p-6">
          <AvatarUploadForm currentUrl={profile?.avatar_url ?? null} initial={initial} />
        </div>
      </section>

      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4">
          <h2 className="font-bold text-secondary">{t("personalTitle")}</h2>
          <p className="mt-0.5 text-xs text-base-content/50">{t("personalSub")}</p>
        </div>
        <form action={updateProfileAction} className="space-y-4 p-6">
          <div>
            <label className="label label-text pb-1 text-xs font-medium">{t("fullNameLabel")}</label>
            <input name="full_name" type="text" className="input input-bordered w-full" defaultValue={profile?.full_name ?? ""} placeholder={t("fullNamePlaceholder")} />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm">{t("saveChanges")}</button>
          </div>
        </form>
      </section>

      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4">
          <h2 className="font-bold text-secondary">{t("emailTitle")}</h2>
          <p className="mt-0.5 text-xs text-base-content/50">
            {t("emailCurrent")}{" "}
            <span className="font-medium text-base-content/70">{user.email}</span>
          </p>
        </div>
        <form action={updateEmailAction} className="space-y-4 p-6">
          <div>
            <label className="label label-text pb-1 text-xs font-medium">{t("newEmailLabel")}</label>
            <input name="email" type="email" className="input input-bordered w-full" placeholder={t("newEmailPlaceholder")} required />
          </div>
          <p className="text-xs text-base-content/40">{t("emailNote")}</p>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-outline btn-sm">{t("changeEmail")}</button>
          </div>
        </form>
      </section>

      <section className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 px-6 py-4">
          <h2 className="font-bold text-secondary">{t("passwordTitle")}</h2>
          <p className="mt-0.5 text-xs text-base-content/50">{t("passwordSub")}</p>
        </div>
        <div className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium tracking-widest">••••••••••••</p>
            <p className="mt-0.5 text-xs text-base-content/40">{t("passwordLink")}</p>
          </div>
          <form action={requestPasswordResetAction}>
            <button type="submit" className="btn btn-outline btn-error btn-sm gap-2">
              <i className="fa-solid fa-key" /> {t("requestChange")}
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-base-content/50">{t("accountInfo")}</h2>
        <div className="space-y-2 text-xs text-base-content/50">
          <div className="flex gap-3">
            <span className="w-24 font-medium">{t("idLabel")}</span>
            <code className="text-secondary/70">{user.id}</code>
          </div>
          <div className="flex gap-3">
            <span className="w-24 font-medium">{t("roleLabel")}</span>
            <span className="capitalize">{profile?.role?.replace("_", " ") ?? "—"}</span>
          </div>
          <div className="flex gap-3">
            <span className="w-24 font-medium">{t("memberSince")}</span>
            <span>
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })
                : "—"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
