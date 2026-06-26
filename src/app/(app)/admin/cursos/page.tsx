import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { STATUS_BADGE } from "@/lib/course-status";
import type { Course } from "@/lib/types";
import { TranslateAllButton } from "./TranslateAllButton";
import { CourseStatusFilter } from "./CourseStatusFilter";

export const metadata = { title: "Gestión de cursos — Yoliti Academy" };

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function createCourse(formData: FormData) {
  "use server";
  const profile = await requireRole(["maestro", "super_admin"]);
  const supabase = await createClient();

  const rawTitle = String(formData.get("title") ?? "").trim();
  if (!rawTitle) return;
  const rawSubtitle = String(formData.get("subtitle") ?? "");
  const rawDescription = String(formData.get("description") ?? "");
  const priceMx = Number(formData.get("price") ?? 0);

  let titleEs = rawTitle, titleEn: string | null = null;
  let subtitleEs = rawSubtitle, subtitleEn: string | null = null;
  let descriptionEs = rawDescription, descriptionEn: string | null = null;

  if (process.env.DEEPL_API_KEY) {
    const { translateAutoDetect } = await import("@/lib/translate");
    const { text: toEn, sourceLang } = await translateAutoDetect(rawTitle, "en-US");
    if (sourceLang.startsWith("en")) {
      titleEn = rawTitle;
      const { text: es } = await translateAutoDetect(rawTitle, "es");
      titleEs = es;
      if (rawSubtitle) { subtitleEn = rawSubtitle; const { text } = await translateAutoDetect(rawSubtitle, "es"); subtitleEs = text; }
      if (rawDescription) { descriptionEn = rawDescription; const { text } = await translateAutoDetect(rawDescription, "es"); descriptionEs = text; }
    } else {
      titleEn = toEn;
      if (rawSubtitle) { const { text } = await translateAutoDetect(rawSubtitle, "en-US"); subtitleEn = text; }
      if (rawDescription) { const { text } = await translateAutoDetect(rawDescription, "en-US"); descriptionEn = text; }
    }
  }

  await supabase.from("courses").insert({
    title: titleEs, subtitle: subtitleEs, description: descriptionEs,
    slug: `${slugify(titleEs)}-${Math.random().toString(36).slice(2, 6)}`,
    level: String(formData.get("level") ?? "principiante"),
    price_cents: Math.round(priceMx * 100),
    currency: String(formData.get("currency") || "usd").toLowerCase(),
    status: String(formData.get("status") ?? "borrador"),
    teacher_id: profile.id,
    title_en: titleEn, subtitle_en: subtitleEn, description_en: descriptionEn,
  });

  revalidatePath("/admin/cursos");
}

export default async function CursosAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;
  const [profile, t, tl, ts] = await Promise.all([
    requireRole(["maestro", "super_admin"]),
    getTranslations("adminCursos"),
    getTranslations("levels"),
    getTranslations("status"),
  ]);
  const supabase = await createClient();

  const query = supabase.from("courses").select("*").order("created_at", { ascending: false });
  if (profile.role !== "super_admin") query.eq("teacher_id", profile.id);
  if (statusFilter) query.eq("status", statusFilter);

  const { data } = await query;
  const courses = (data as Course[]) ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary">{t("title")}</h1>
          <p className="mt-1 text-sm text-base-content/60">{t("subtitle")}</p>
        </div>
        {process.env.DEEPL_API_KEY && <TranslateAllButton />}
      </div>

      <CourseStatusFilter />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <section>
          {courses.length === 0 ? (
            <div className="rounded-box border border-dashed border-base-300 p-12 text-center text-sm text-base-content/50">
              {t("empty")}
            </div>
          ) : (
            <div className="overflow-hidden rounded-box border border-base-300 bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t("colCourse")}</th>
                    <th>{t("colLevel")}</th>
                    <th>{t("colPrice")}</th>
                    <th>{t("colStatus")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id} className="hover">
                      <td className="font-medium">{c.title}</td>
                      <td className="text-sm text-base-content/60">{tl(c.level)}</td>
                      <td className="text-sm">
                        {c.price_cents === 0 ? t("free") : formatPrice(c.price_cents, c.currency)}
                      </td>
                      <td>
                        <span className={`badge badge-sm ${STATUS_BADGE[c.status]}`}>
                          {ts(c.status)}
                        </span>
                      </td>
                      <td>
                        <Link href={`/admin/cursos/${c.id}`} className="btn btn-primary btn-xs">
                          <i className="fa-solid fa-pen" /> {t("edit")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-secondary">{t("newCourse")}</h2>
            <form action={createCourse} className="space-y-3">
              <div>
                <label htmlFor="title" className="mb-1 block text-sm font-medium">{t("titleLabel")}</label>
                <input id="title" name="title" required className="input input-sm w-full" />
              </div>
              <div>
                <label htmlFor="subtitle" className="mb-1 block text-sm font-medium">{t("subtitleLabel")}</label>
                <input id="subtitle" name="subtitle" className="input input-sm w-full" />
              </div>
              <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium">{t("descriptionLabel")}</label>
                <textarea id="description" name="description" className="textarea textarea-sm w-full" />
              </div>
              <div>
                <label htmlFor="level" className="mb-1 block text-sm font-medium">{t("levelLabel")}</label>
                <select id="level" name="level" className="select select-sm w-full">
                  <option value="principiante">{tl("principiante")}</option>
                  <option value="intermedio">{tl("intermedio")}</option>
                  <option value="avanzado">{tl("avanzado")}</option>
                </select>
              </div>
              <div>
                <label htmlFor="price" className="mb-1 block text-sm font-medium">{t("priceLabel")}</label>
                <div className="flex gap-2">
                  <select name="currency" className="select select-sm w-24 shrink-0">
                    <option value="usd">USD</option>
                    <option value="mxn">MXN</option>
                  </select>
                  <input id="price" name="price" type="number" min="0" step="1" defaultValue={0} className="input input-sm flex-1" />
                </div>
              </div>
              <div>
                <label htmlFor="status" className="mb-1 block text-sm font-medium">{t("statusLabel")}</label>
                <select id="status" name="status" className="select select-sm w-full">
                  <option value="borrador">{ts("borrador")}</option>
                  <option value="publicado">{ts("publicado")}</option>
                  <option value="privado">{ts("privado")}</option>
                </select>
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
