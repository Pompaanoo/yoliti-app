import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { createGroup } from "@/lib/server-actions";
import { DeleteGroupButton } from "./_components/DeleteGroupButton";
import type { Group } from "@/lib/types";

export const metadata = { title: "Grupos — Yoliti Academy" };

export default async function GruposPage() {
  const [profile, t] = await Promise.all([
    requireRole(["maestro", "super_admin"]),
    getTranslations("adminGrupos"),
  ]);
  const supabase = await createClient();

  const query = supabase.from("groups").select("*").order("created_at", { ascending: false });
  if (profile.role !== "super_admin") query.eq("teacher_id", profile.id);

  const { data } = await query;
  const groups = (data as Group[]) ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-secondary">{t("title")}</h1>
        <p className="mt-1 text-sm text-base-content/60">{t("subtitle")}</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          {groups.length === 0 ? (
            <div className="rounded-box border border-dashed border-base-300 p-12 text-center text-sm text-base-content/50">
              {t("empty")}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {groups.map((g) => (
                <div key={g.id} className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
                  {g.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.image_url} alt={g.name} className="mb-3 h-32 w-full rounded-lg object-cover" />
                  ) : (
                    <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-primary/10">
                      <i className="fa-solid fa-people-group text-3xl text-primary/40" />
                    </div>
                  )}
                  <h3 className="font-bold text-secondary">{g.name}</h3>
                  {g.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-base-content/50">{g.description}</p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Link href={`/admin/grupos/${g.id}`} className="btn btn-primary btn-sm flex-1">
                      <i className="fa-solid fa-pen" /> {t("editBtn")}
                    </Link>
                    <DeleteGroupButton id={g.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-secondary">{t("newGroup")}</h2>
            <form action={createGroup} className="space-y-3">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium">{t("nameLabel")}</label>
                <input id="name" name="name" required className="input input-sm w-full" placeholder={t("namePlaceholder")} />
              </div>
              <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium">{t("descriptionLabel")}</label>
                <textarea id="description" name="description" className="textarea textarea-sm h-20 w-full" placeholder={t("descriptionPlaceholder")} />
              </div>
              <div>
                <label htmlFor="image_url" className="mb-1 block text-sm font-medium">{t("imageLabel")}</label>
                <input id="image_url" name="image_url" type="url" className="input input-sm w-full" placeholder="https://..." />
              </div>
              <button className="btn btn-primary btn-sm btn-block">
                <i className="fa-solid fa-plus" /> {t("createBtn")}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
